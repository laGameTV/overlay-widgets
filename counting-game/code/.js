var fieldData;
var bannedUsers;
var highscore;
var initialHighscore;
var reveal;
window.addEventListener("onWidgetLoad", async function (obj) {
	//console.clear();
	fieldData = obj.detail.fieldData;
	bannedUsers = fieldData.excludeUser
		.toLowerCase()
		.split(",")
		.map((x) => x.trim());
	reveal = fieldData.reveal;
	console.log(bannedUsers);

	//highscore = Math.floor(fieldData.highscore) || 0;
	//initialHighscore = Math.floor(fieldData.highscore) || -1;
	//console.log(await SE_API.store.get('counting_highscore', {value:highscore}))
	await SE_API.store.get("counting_highscore").then((obj) => {
		highscore = obj.value ? obj.value : 0;
		initialHighscore = obj.value ? obj.value : -1;
	});

	switch (fieldData.rulesPosition) {
		case "left":
			$(".main-container .rules").css("left", "0");
			$(".main-container .rules").show();
			break;
		case "right":
			$(".main-container .rules").css("right", "0");
			$(".main-container .rules").show();
			break;
		case "none":
			$(".main-container .rules").hide();
			break;
	}
	$(".highscore").text("Aktueller Highscore: " + highscore);
});

var counter = 0;
var lastCounter = "none";
//
window.addEventListener("onEventReceived", async function (obj) {
	const listener = obj.detail.listener.split("-")[0];
	//console.log(fieldData)

	switch (listener) {
		case "message":
			console.log(obj);
			var msg = obj.detail.event.data.text.trim();
			var usr = obj.detail.event.data.userId;
			var dpn = obj.detail.event.data.displayName;
			console.log({
				msg,
				usr,
				lastCounter,
				counter,
			});
			//$('.msg').text(msg)
			if (bannedUsers.includes(dpn.toLowerCase())) return;
			if (isNaN(msg)) return;
			if (usr == lastCounter) {
				$(".msg").text(`Selbe Person!${reveal ? ` (${dpn})` : ""}`);
				return resetCounter();
			}
			lastCounter = usr;
			if (msg == counter + 1) addCounter();
			else {
				$(".msg").text(`Falsche Zahl!${reveal ? ` (${dpn})` : ""}`);
				return resetCounter();
			}
			break;
		case "event:test":
			console.log("button");
			var data = obj.detail.event;
			if (data.field === "resetButton" && data.value === "reset") {
				await SE_API.store.set("counting_highscore", {
					value: 0,
				});
				highscore = 0;
				initialHighscore = -1;
				$(".highscore").text("Aktueller Highscore: " + highscore);
			}
			break;
	}
});

async function addCounter() {
	counter++;
	$(".counter").text(counter);
	if (counter > highscore) {
		highscore = counter;
		await SE_API.store.set("counting_highscore", {
			value: highscore,
		});
		$(".msg").text("Neuer Highscore!");
		$(".highscore").text("Aktueller Highscore: " + highscore);
	} else {
		$(".msg").text("Aktueller Score:");
	}
	if (counter - 1 == initialHighscore) {
		var duration = 5 * 1000;
		var animationEnd = Date.now() + duration;
		var defaults = {
			startVelocity: 30,
			spread: 360,
			ticks: 60,
			zIndex: 0,
		};

		function randomInRange(min, max) {
			return Math.random() * (max - min) + min;
		}

		var interval = setInterval(function () {
			var timeLeft = animationEnd - Date.now();

			if (timeLeft <= 0) {
				return clearInterval(interval);
			}

			var particleCount = 50 * (timeLeft / duration);
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
}

function resetCounter() {
	counter = 0;
	lastCounter = "none";
	//$('.msg').text("Looossser lol")
	$(".counter").text(counter);
}
