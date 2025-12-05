let fieldData, bannedUsers, highscore, initialHighscore, reveal, highscoreToday, initialHighscoreToday;
let highscoreDate, highscoreTodayDate;
// Cache jQuery selectors for better performance
let $msg, $counterElement, $highscoreValAlltime, $highscoreValToday, $highscoreLabel, $highscoreContainer, $rules;

window.addEventListener("onWidgetLoad", async function (obj) {
	console.clear();
	log("Loading widget...")

	// Initialize cached selectors once
	$msg = $(".msg");
	$counterElement = $(".counter");
	// Use IDs directly for better robustness
	$highscoreValAlltime = $("#value-alltime");
	$highscoreValToday = $("#value-today");
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
				const now = new Date();
				await saveHighscoreData(0, now, 0, now);
				initHighscoreState(0, now, 0, now);
				resetCounter(); // Also reset current counter
			}
			break;
	}
});

async function loadHighscore() {
	const now = new Date();
	try {
		let obj = await SE_API.store.get("counting_highscore");

		// Migration: Check if old format exists (number or {value: number})
		if (obj && (typeof obj === 'number' || typeof obj.value === 'number')) {
			const oldScore = typeof obj === 'number' ? obj : obj.value;
			obj = createHighscoreObj(oldScore, now);
			log("Migrating highscore to new format...", oldScore, obj);
			await SE_API.store.set("counting_highscore", obj);
		}

		// Initialize if empty or invalid structure
		if (!obj || !obj.allTime) {
			obj = createHighscoreObj(0, now);
		}

		// Parse Today logic
		const todayObj = obj.today || { score: 0, date: now };
		const lastDate = new Date(todayObj.date);
		const isSameDay = lastDate.toDateString() === now.toDateString();

		const currentTodayScore = isSameDay ? (Number(todayObj.score) || 0) : 0;
		const currentTodayDate = isSameDay ? lastDate : now;

		initHighscoreState(obj.allTime.score, new Date(obj.allTime.date), currentTodayScore, currentTodayDate);

	} catch (e) {
		log("SE_API: Highscore konnte nicht geladen werden. Versuche Initialisierung...", e);
		try {
			await saveHighscoreData(0, now, 0, now);
			initHighscoreState(0, now, 0, now);
			log("SE_API: Highscore erfolgreich initialisiert.");
		} catch (retryError) {
			log("SE_API Error: Highscore konnte nicht initialisiert werden. Feature deaktiviert.", retryError);
			$highscoreContainer.hide();
			initHighscoreState(0, now, 0, now);
		}
	}
}

function createHighscoreObj(score, date) {
	return {
		allTime: { score: score, date: date },
		today: { score: 0, date: date }
	};
}

function initHighscoreState(allTime, allTimeDate, today, todayDate) {
	highscore = allTime;
	highscoreDate = allTimeDate;
	initialHighscore = highscore > 0 ? highscore : -1;

	highscoreToday = today;
	highscoreTodayDate = todayDate;
	initialHighscoreToday = highscoreToday > 0 ? highscoreToday : -1;

	renderHighscoreUI();
}

function renderHighscoreUI() {
	$highscoreValAlltime.text(highscore);
	if ($highscoreValToday && $highscoreValToday.length) $highscoreValToday.text(highscoreToday);
}

async function saveHighscoreData(allTime, allTimeDate, today, todayDate) {
	return SE_API.store.set("counting_highscore", {
		allTime: { score: allTime, date: allTimeDate },
		today: { score: today, date: todayDate }
	});
}

async function addCounter() {
	counter++;
	$counterElement.text(counter);

	await updateHighscore(counter);
}

async function updateHighscore(currentVal) {
	let saveNeeded = false;
	let allTimeBroken = false;
	let todayBroken = false;

	// --- All Time Logic ---
	if (currentVal > initialHighscore) {
		highscore = currentVal;
		allTimeBroken = true;
		saveNeeded = true;
	}

	// --- Today Logic ---
	if (currentVal > initialHighscoreToday) {
		highscoreToday = currentVal;
		todayBroken = true;
		saveNeeded = true;
	}

	// UI Updates
	if (allTimeBroken && initialHighscore > 0) {
		$msg.text("Neuer Highscore!");
		$highscoreLabel.text("Alter Highscore:");
		$highscoreValAlltime.text(initialHighscore);
		// Manually update today value since we don't use renderHighscoreUI here
		if ($highscoreValToday && $highscoreValToday.length) $highscoreValToday.text(highscoreToday);
	} else {
		$msg.text("Aktueller Score:");
		$highscoreLabel.text("Aktueller Highscore:");
		renderHighscoreUI();
	}

	// --- Storage Logic ---
	if (saveNeeded) {
		if (allTimeBroken) highscoreDate = new Date();
		if (todayBroken) highscoreTodayDate = new Date();

		try {
			await saveHighscoreData(highscore, highscoreDate, highscoreToday, highscoreTodayDate);
		} catch (e) {
			log("Error saving highscore", e);
		}
	}

	// Trigger confetti on highscore break OR every 100 steps
	// Priority: Highscore break > Milestone (to avoid double trigger if highscore is e.g. 99 and we hit 100)
	if (currentVal - 1 === initialHighscore && initialHighscore > 0) {
		triggerConfetti();
	} else if (currentVal % 100 === 0) {
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
					x: Math.random() * 0.3 + 0.2,
					y: Math.random() - 0.2,
				},
			})
		);
		confetti(
			Object.assign({}, defaults, {
				particleCount,
				origin: {
					x: Math.random() * 0.3 + 0.5,
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
	if (highscore > initialHighscore) initialHighscore = highscore;
	if (highscoreToday > initialHighscoreToday) initialHighscoreToday = highscoreToday;

	// Reset UI to show current highscore
	$highscoreLabel.text("Aktueller Highscore:");
	renderHighscoreUI();

	$counterElement.text(counter);
}

function log(...t) {
	console.log("%cCounting Game%c", "background: MediumVioletRed; color: #fff; padding: 2px 4px; border-radius: 2px;", "", ...t)
}