let fieldData, bannedUsers, highscore, initialHighscore, reveal;
// Cache jQuery selectors for better performance
let $msg, $counterElement, $highscoreVal, $highscoreLabel, $rules;

window.addEventListener("onWidgetLoad", async function (obj) {
	console.clear();
	log("Loading widget...")

	// Initialize cached selectors once
	$msg = $(".msg");
	$counterElement = $(".counter");
	$highscoreVal = $(".highscore #value");
	$highscoreLabel = $(".highscore #label");
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
	if (fieldData.rulesPosition !== "none") {
		$rules.css(fieldData.rulesPosition, "0").show();
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
					value: 0,
				});
				highscore = 0;
				initialHighscore = -1;
				$highscoreLabel.text("Aktueller Highscore:");
				$highscoreVal.text(highscore);
				resetCounter(); // Also reset current counter
			}
			break;
	}
});

async function loadHighscore() {
	try {
		const obj = await SE_API.store.get("counting_highscore");
		highscore = obj.value ?? 0;
		initialHighscore = obj.value ?? -1;
		$highscoreVal.text(highscore);
	} catch (e) {
		log("SE_API: Highscore konnte nicht geladen werden. Versuche Initialisierung...", e);
		try {
			// Try to set default value to initialize key
			await SE_API.store.set("counting_highscore", { value: 0 });
			// Try to read again
			const obj = await SE_API.store.get("counting_highscore");
			highscore = obj.value ?? 0;
			initialHighscore = obj.value ?? -1;
			$highscoreVal.text(highscore);
			log("SE_API: Highscore erfolgreich initialisiert.");
		} catch (retryError) {
			log("SE_API Error: Highscore konnte nicht initialisiert werden. Feature deaktiviert.", retryError);
			$(".highscore").hide();
			highscore = 0;
			initialHighscore = -1;
		}
	}
}

async function addCounter() {
	counter++;
	$counterElement.text(counter);

	// Check if we are strictly above the starting highscore of this run
	if (counter > initialHighscore) {
		highscore = counter;

		// Only show "New Highscore" and trigger confetti if the previous highscore was > 0
		// (initialHighscore is -1 if it was 0)
		if (initialHighscore > 0) {
			$msg.text("Neuer Highscore!");

			// Show "Alter Highscore" label and the old value
			$highscoreLabel.text("Alter Highscore:");
			$highscoreVal.text(initialHighscore);
		} else {
			$msg.text("Aktueller Score:");
			$highscoreLabel.text("Aktueller Highscore:");
			$highscoreVal.text(highscore);
		}

		// Save to store in background
		await SE_API.store.set("counting_highscore", {
			value: highscore,
		});
	} else {
		$msg.text("Aktueller Score:");
		// Ensure label is correct
		$highscoreLabel.text("Aktueller Highscore:");
		$highscoreVal.text(highscore);
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

	// Reset UI to show current highscore
	$highscoreLabel.text("Aktueller Highscore:");
	$highscoreVal.text(highscore);

	$counterElement.text(counter);
}

function log(...t) {
	console.log("%cCounting Game%c", "background: MediumVioletRed; color: #fff; padding: 2px 4px; border-radius: 2px;", "", ...t)
}