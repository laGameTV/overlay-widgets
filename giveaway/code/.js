var fieldData;
var wheel;
var celebration;
var joinCmd;
var jebaitedToken;
var jebaitedURL;
var botLanguage;
window.addEventListener("onWidgetLoad", async function (obj) {
	//console.clear();
	fieldData = obj.detail.fieldData;
	//apiToken=obj["detail"]["channel"]["apiToken"];
	joinCmd = fieldData.joinCommand;
	jebaitedToken = fieldData.jebaited || undefined;
	botLanguage = fieldData.botLanguage || "en";

	wheel = fieldData.dingSound ? new Audio(fieldData.dingSound) : undefined;
	celebration = fieldData.celebrationSound ? new Audio(fieldData.celebrationSound) : undefined;
	if (celebration) celebration.volume = fieldData.celebrationVolume;

	if (jebaitedToken) jebaitedURL = "https://api.jebaited.net/botMsg/" + jebaitedToken + "/";
});

window.addEventListener("onEventReceived", function (obj) {
	const listener = obj.detail.listener.split("-")[0];
	//console.log(fieldData)
	switch (listener) {
		case "message":
			var msg = obj.detail.event.data.text.toLowerCase();
			var usr = obj.detail.event.data.displayName;
			if (msg.startsWith("!giveaway")) {
				if (!(obj.detail.event.data.tags.badges.includes("moderator") || obj.detail.event.data.tags.badges.includes("broadcaster"))) return;
				console.log(obj.detail, obj.detail.event.data.text.split(" "));
				var split = obj.detail.event.data.text.split(" ");
				if (split[1] === "end") {
					if (!$(".main-container").hasClass("open")) return;
					if ($(".main-container").hasClass("timed")) return;
					console.log("Ending giveaway (Command)");
					return endGiveaway();
				}
				if ($(".main-container").hasClass("active")) return;
				input = isNaN(obj.detail.event.data.text.split(" ")[1]) ? undefined : obj.detail.event.data.text.split(" ")[1];
				console.log(`Starting Giveaway: !giveaway ${input}`);
				startGiveaway(input);
			} else if (msg.startsWith(joinCmd)) {
				//console.log(obj.detail)
				if (!$(".main-container").hasClass("open")) return;
				var participants = $(".participants-container h1")
					.map(function () {
						return $(this).text();
					})
					.toArray();
				if (participants.includes(usr)) return;
				console.log(`Joining Giveaway: ${usr}`);
				memberJoin(usr);
			}
			break;
	}
});

function startGiveaway(duration) {
	if (duration <= 0) return;
	if (jebaitedURL) {
		switch (botLanguage) {
			case "de":
				fetch(
					jebaitedURL +
						encodeURIComponent(
							`Ein Gewinnspiel ${duration ? `welches noch ${duration} Sekunden geht ` : ""}hat gestartet! Benutze ${joinCmd} zum mit zu machen!`
						)
				);
				break;
			case "en":
				fetch(
					jebaitedURL + encodeURIComponent(`A giveaway ${duration ? `which lasts ${duration} seconds ` : ""}has started! Use ${joinCmd} to enter!`)
				);
				break;
		}
	}
	$(".participants-container").empty();
	$(".title h2").text(`${joinCmd} (0 - 0%)`);
	$(".main-container").addClass("active");
	$(".main-container").addClass("open");
	if (duration) {
		$(".main-container").addClass("timed");
		$(".timer").show();
		$(".timer").css("width", "100%");
		$(".timer").animate(
			{
				width: "0%",
			},
			{
				easing: "linear",
				duration: duration * 1000,
			}
		);
		setTimeout(() => {
			endGiveaway();
		}, duration * 1000);
	} else {
		$(".timer").hide();
	}
}

function endGiveaway() {
	$(".main-container").removeClass("open");
	var participants = $(".participants-container").children().length;
	var p = (1 / participants) * 100;
	$(".title h2").text(`Closed (${participants} - ${participants === 0 ? "0" : p.toFixed(2)}%)`);
	setTimeout(() => {
		// var participants = $(".participants-container").children();
		var participants = $(".participants-container h1")
			.map(function () {
				return $(this).text();
			})
			.toArray();
		if (participants.length === 0) {
			$(".reveal-container h1").fadeOut();
			$(".main-container").removeClass("active");
			$(".main-container").removeClass("timed");
			return;
		}
		if (participants.length === 1) {
			$(".reveal-container h1").fadeIn().text(participants[0]);
			setTimeout(() => {
				if (celebration) celebration.play();
				if (jebaitedURL) {
					switch (botLanguage) {
						case "de":
							fetch(jebaitedURL + encodeURIComponent(`${participants[0]} hat das Gewinnspiel gewonnen! Herzlichen Glückwunsch!`));
							break;
						case "en":
							fetch(jebaitedURL + encodeURIComponent(`${participants[0]} has won the giveaway! Congratulations!`));
							break;
					}
				}
				var duration = 7.5 * 1000;
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
								x: randomInRange(0.1, 0.3),
								y: Math.random() - 0.2,
							},
						})
					);
					confetti(
						Object.assign({}, defaults, {
							particleCount,
							origin: {
								x: randomInRange(0.7, 0.9),
								y: Math.random() - 0.2,
							},
						})
					);
				}, 250);
				setTimeout(() => {
					$(".reveal-container h1").fadeOut();
					$(".main-container").removeClass("active");
					$(".main-container").removeClass("timed");
				}, 7.5 * 1000);
			}, 1000);
			return;
		}
		async function printDelays(max) {
			for (let i = 1; i <= max; i++) {
				const delay = (Math.pow(6, i / 12) / i + Math.pow(i / 30, 8)) * 150;
				await new Promise((resolve) => setTimeout(resolve, delay));
				console.log(`${i}: ${delay}ms`);
				var pick = participants[Math.floor(Math.random() * participants.length)];
				$(".reveal-container h1").fadeIn().text(pick);
				if (wheel) {
					var wheelSound = wheel.cloneNode(true);
					wheelSound.volume = fieldData.dingVolume;
					wheelSound.play();
				}

				if (i === max) {
					setTimeout(() => {
						if (celebration) celebration.play();
						if (jebaitedToken) {
							switch (botLanguage) {
								case "de":
									fetch(jebaitedURL + encodeURIComponent(`${pick} hat das Gewinnspiel gewonnen! Herzlichen Glückwunsch!`));
									break;
								case "en":
									fetch(jebaitedURL + encodeURIComponent(`${pick} has won the giveaway! Congratulations!`));
									break;
							}
						}
						var duration = 7.5 * 1000;
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
										x: randomInRange(0.1, 0.3),
										y: Math.random() - 0.2,
									},
								})
							);
							confetti(
								Object.assign({}, defaults, {
									particleCount,
									origin: {
										x: randomInRange(0.7, 0.9),
										y: Math.random() - 0.2,
									},
								})
							);
						}, 250);
						setTimeout(() => {
							$(".reveal-container h1").fadeOut();
							$(".main-container").removeClass("timed");
							$(".main-container").removeClass("active");
						}, 7.5 * 1000);
					}, 1000);
				}
			}
		}
		printDelays(32);
	}, 1500);
}

function memberJoin(username) {
	var newMember = $(`<div class="member"><h1>${username}</h1></div>`);
	$(".participants-container").prepend(newMember);
	var participants = $(".participants-container").children().length;
	var p = (1 / participants) * 100;
	$(".title h2").text(`${joinCmd} (${participants} - ${p.toFixed(2)}%)`);
	if (jebaitedToken) {
		switch (botLanguage) {
			case "de":
				fetch(jebaitedURL + encodeURIComponent(`@${username}, Teilnahme erfolgreich.`));
				break;
			case "en":
				fetch(jebaitedURL + encodeURIComponent(`@${username}, participation successful.`));
				break;
		}
	}
}
