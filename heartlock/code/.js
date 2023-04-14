var fieldData;
var image;
var color;
var emotes;
window.addEventListener("onWidgetLoad", function (obj) {
	console.clear();
	fieldData = obj.detail.fieldData;
	image = fieldData.image || "https://github.com/laGameTV/overlay-widgets/blob/main/heartlock/src/heart.png?raw=true";
	color = fieldData.color || "#9147ff";
	emotes = fieldData.emotes
		.toLowerCase()
		.split(",")
		.map((x) => x.trim());
	console.log({
		image,
		color,
		emotes,
	});
	$(".image").attr("src", image);
});

var count = 0;
var total = 0;

window.addEventListener("onEventReceived", function (obj) {
	const listener = obj.detail.listener.split("-")[0];
	//console.log(fieldData)
	switch (listener) {
		case "message":
			var msg = obj.detail.event.data.text;
			if (msg.startsWith("!heartlock")) {
				if (!(obj.detail.event.data.tags.badges.includes("moderator") || obj.detail.event.data.tags.badges.includes("broadcaster"))) return;
				console.log(obj.detail);
				count = 0;
				total = isNaN(obj.detail.event.data.text.split(" ")[1]) ? 50 : obj.detail.event.data.text.split(" ")[1];
				var p = (count / total) * 100;
				$(".counter").text(`${count}/${total} (${Math.floor(p)}%)`);
				$(".wave").css("height", `${Math.floor(p)}%`);

				$(".main-container").fadeIn();
			} else {
				var eCount = 0;
				emotes.forEach((e) => {
					eCount += occurrences(msg.toLowerCase(), e, false);
					//console.log(eCount, msg, e)
				});
				//console.log(obj.detail.event.data.text)
				if (total === 0) return;
				if (count >= total) return;
				// count++;
				if (count + eCount > total) {
					count = total;
				} else {
					count += eCount;
				}
				if (count === total) {
					$(".main-container").fadeOut(2500);
					var duration = 7.5 * 1000;
					var animationEnd = Date.now() + duration;
					var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

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
						confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
						confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
					}, 250);
				}
				var p = (count / total) * 100;
				$(".counter").text(`${count}/${total} (${Math.floor(p)}%)`);
				$(".wave").css("height", `${Math.floor(p)}%`);
			}
			break;
	}
});

function occurrences(string, subString, allowOverlapping) {
	string += "";
	subString += "";
	if (subString.length <= 0) return string.length + 1;

	var n = 0,
		pos = 0,
		step = allowOverlapping ? 1 : subString.length;

	while (true) {
		pos = string.indexOf(subString, pos);
		if (pos >= 0) {
			++n;
			pos += step;
		} else break;
	}
	return n;
}
