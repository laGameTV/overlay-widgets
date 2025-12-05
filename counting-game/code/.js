let fieldData, bannedUsers, highscore, initialHighscore, reveal, highscoreToday, initialHighscoreToday;
// Cache jQuery selectors for better performance
let $msg, $counterElement, $highscoreValAlltime, $highscoreValToday, $highscoreLabel, $highscoreContainer, $rules;

window.addEventListener("onWidgetLoad", async function (obj) {
	console.clear();
	log("Loading widget...")

	// Initialize cached selectors once
	$msg = $(".msg");
	$counterElement = $(".counter");
	$highscoreValAlltime = $(".highscore #value-alltime");
	$highscoreValToday = $(".highscore-today #value-today");
	$highscoreLabel = $(".highscore #label");
	$highscoreContainer = $(".highscore");
	$rules = $(".main-container .rules");

	fieldData = obj.detail.fieldData;
	bannedUsers = fieldData.excludeUser
		.toLowerCase()
		.split(",")
		.map((x) => x.trim());
	reveal = fieldData.reveal;
	log("Loaded data", { fieldData, bannedUsers, highscore, initialHighscore, reveal })

	await loadHighscore();

	// Optimized rules positioning logic
	$rules.hide().css({ left: "", right: "" }); // Reset positions
	$highscoreContainer.hide().css({ top: "", bottom: "" }); // Reset positions
	if (fieldData.rulesPosition !== "none") {
		$rules.css(fieldData.rulesPosition, "0").show();
	}

	if (fieldData.highscorePosition !== "none") {
		$highscoreContainer.css(fieldData.highscorePosition, "0").show();
	}
});

let counter = 0;
let lastCounter = "none";
//
window.addEventListener("onEventReceived", async function (obj) {
	const listener = obj.detail.listener.split("-")[0];
	//console.log(fieldData)

	switch (listener) {
		case "message":
			// Destructuring for cleaner access
			const { text, userId: usr, displayName: dpn } = obj.detail.event.data;
			const msgText = text.trim();

			// Parse message to integer explicitly
			const msgNumber = parseInt(msgText, 10);

			// log({
			// 	msg: msgText,
			// 	usr,
			// 	lastCounter,
			// 	counter,
			// });

			//$('.msg').text(msg)
			if (bannedUsers.includes(dpn.toLowerCase())) return; // Ignore banned users

			// Improved validation: Check if parsed number is valid AND matches the original string
			// This prevents cases like "12abc" being parsed as 12
			if (isNaN(msgNumber) || String(msgNumber) !== msgText) return;

			// If number is smaller than 1, ignore
			if (msgNumber < 1) return;

			log("New message:", `<${dpn}> ${msgText}`)

			if (usr === lastCounter) { // Reset if same person twice (use strict equality)
				$msg.text(`Selbe Person!${reveal ? ` (${dpn})` : ""}`);
				return resetCounter();
			}
			lastCounter = usr;

			if (msgNumber === counter + 1) addCounter(); // Add counter
			else { // Reset if wrong number
				$msg.text(`Falsche Zahl!${reveal ? ` (${dpn})` : ""}`);
				return resetCounter();
			}
			break;

		case "event:test":
			const data = obj.detail.event;
			if (data.field === "resetButton" && data.value === "reset") {
				log("Highscore reset")
				await SE_API.store.set("counting_highscore", {
					allTime: { score: 0, date: new Date() },
					today: { score: 0, date: new Date() }
				});
				highscore = 0;
				initialHighscore = -1;
				highscoreToday = 0;
				initialHighscoreToday = -1;
				$highscoreLabel.text("Aktueller Highscore:");
				$highscoreValAlltime.text(highscore);
				if ($highscoreValToday) $highscoreValToday.text(0);
				resetCounter(); // Also reset current counter
			}
			break;
	}
});

async function loadHighscore() {
	try {
		let obj = await SE_API.store.get("counting_highscore");

		// Migration: Check if old format exists (number or {value: number})
		if (obj && (typeof obj === 'number' || typeof obj.value === 'number')) {
			const oldScore = typeof obj === 'number' ? obj : obj.value;
			log("Migrating highscore to new format...", oldScore);
			obj = {
				allTime: { score: oldScore, date: new Date() },
				today: { score: 0, date: new Date() }
			};
			await SE_API.store.set("counting_highscore", obj);
		}

		// Initialize if empty or invalid structure
		if (!obj || !obj.allTime) {
			obj = {
				allTime: { score: 0, date: new Date() },
				today: { score: 0, date: new Date() }
			};
		}

		highscore = obj.allTime.score;
		initialHighscore = highscore > 0 ? highscore : -1;

		// Today logic
		const todayObj = obj.today || { score: 0, date: new Date() };
		const lastDate = new Date(todayObj.date);
		const now = new Date();
		const isSameDay = lastDate.getDate() === now.getDate() &&
			lastDate.getMonth() === now.getMonth() &&
			lastDate.getFullYear() === now.getFullYear();

		highscoreToday = isSameDay ? (todayObj.score || 0) : 0;
		initialHighscoreToday = highscoreToday > 0 ? highscoreToday : -1;

		$highscoreValAlltime.text(highscore);
		if ($highscoreValToday) $highscoreValToday.text(highscoreToday);

	} catch (e) {
		log("SE_API: Highscore konnte nicht geladen werden. Versuche Initialisierung...", e);
		try {
			// Try to set default value to initialize key
			const newObj = {
				allTime: { score: 0, date: new Date() },
				today: { score: 0, date: new Date() }
			};
			await SE_API.store.set("counting_highscore", newObj);
			// Try to read again
			highscore = 0;
			initialHighscore = -1;
			highscoreToday = 0;
			initialHighscoreToday = -1;
			$highscoreValAlltime.text(highscore);
			if ($highscoreValToday) $highscoreValToday.text(0);
			log("SE_API: Highscore erfolgreich initialisiert.");
		} catch (retryError) {
			log("SE_API Error: Highscore konnte nicht initialisiert werden. Feature deaktiviert.", retryError);
			$highscoreContainer.hide();
			highscore = 0;
			initialHighscore = -1;
			highscoreToday = 0;
			initialHighscoreToday = -1;
		}
	}
}

async function addCounter() {
	counter++;
	$counterElement.text(counter);

	let saveNeeded = false;

	// Check if we are strictly above the starting highscore of this run
	if (counter > initialHighscore) {
		highscore = counter;

		// Only show "New Highscore" and trigger confetti if the previous highscore was > 0
		// (initialHighscore is -1 if it was 0)
		if (initialHighscore > 0) {
			$msg.text("Neuer Highscore!");

			// Show "Alter Highscore" label and the old value
			$highscoreLabel.text("Alter Highscore:");
			$highscoreValAlltime.text(initialHighscore);
		} else {
			$msg.text("Aktueller Score:");
			$highscoreLabel.text("Aktueller Highscore:");
			$highscoreValAlltime.text(highscore);
		}
		saveNeeded = true;
	} else {
		$msg.text("Aktueller Score:");
		// Ensure label is correct
		$highscoreLabel.text("Aktueller Highscore:");
		$highscoreValAlltime.text(highscore);
	}

	// Today Logic
	if (counter > initialHighscoreToday) {
		highscoreToday = counter;
		if ($highscoreValToday) $highscoreValToday.text(highscoreToday);
		saveNeeded = true;
	} else {
		if ($highscoreValToday) $highscoreValToday.text(highscoreToday);
	}

	if (saveNeeded) {
		// Save to store in background
		await SE_API.store.set("counting_highscore", {
			allTime: { score: highscore, date: new Date() },
			today: { score: highscoreToday, date: new Date() }
		});
	}

	// Trigger confetti on highscore break OR every 100 steps
	// Priority: Highscore break > Milestone (to avoid double trigger if highscore is e.g. 99 and we hit 100)
	if (counter - 1 === initialHighscore && initialHighscore > 0) {
		triggerConfetti();
	} else if (counter % 100 === 0) {
		triggerConfetti();
	}
}

function triggerConfetti() {
	const duration = 5 * 1000;
	const animationEnd = Date.now() + duration;
	const defaults = {
		startVelocity: 30,
		spread: 360,
		ticks: 60,
		zIndex: 0,
	};

	function randomInRange(min, max) {
		return Math.random() * (max - min) + min;
	}

	const interval = setInterval(function () {
		const timeLeft = animationEnd - Date.now();

		if (timeLeft <= 0) {
			return clearInterval(interval);
		}

		const particleCount = 50 * (timeLeft / duration);
		// since particles fall down, start a bit higher than random
		confetti(
			Object.assign({}, defaults, {
				particleCount,
				origin: {
					x: randomInRange(0.2, 0.5),
					y: Math.random() - 0.2,
				},
			})
		);
		confetti(
			Object.assign({}, defaults, {
				particleCount,
				origin: {
					x: randomInRange(0.5, 0.8),
					y: Math.random() - 0.2,
				},
			})
		);
	}, 250);
}

function resetCounter() {
	counter = 0;
	lastCounter = "none";

	// If we broke the record, the new "initial" for next run is the current highscore
	if (highscore > initialHighscore) {
		initialHighscore = highscore;
	}
	if (highscoreToday > initialHighscoreToday) {
		initialHighscoreToday = highscoreToday;
	}

	// Reset UI to show current highscore
	$highscoreLabel.text("Aktueller Highscore:");
	$highscoreValAlltime.text(highscore);
	if ($highscoreValToday) $highscoreValToday.text(highscoreToday);

	$counterElement.text(counter);
}

function log(...t) {
	console.log("%cCounting Game%c", "background: MediumVioletRed; color: #fff; padding: 2px 4px; border-radius: 2px;", "", ...t)
}