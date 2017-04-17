var window = window;
	window.tick = 25;
	window.time = 0;

	window.load = function (update) {
		window.onmousedown = update;
		window.onmousemove = update;
		window.onmouseup = update;
		window.onresize = update;
		window.ontick (update);
	}

	window.ontick = function (update) {
		window.setInterval (function () {
			window.time += window.tick;
			update ({ type: 'tick' });
		}, window.tick);
	}

var canvas = window.document.createElement ('canvas');

	canvas.load = function () {
		canvas.style.left = 0;
		canvas.style.position = 'absolute';
		canvas.style.top = 0;
		canvas.resize ();
		window.document.body.appendChild (canvas);
	}

	canvas.resize = function () {
		canvas.height = window.innerHeight;
		canvas.width = window.innerWidth;
	}

var context = canvas.getContext ('2d');

var app = {
	create: {
		object: function (_) {
			let object = _ || {};
				object.id = _.id || app.id++;

				object.load = function () {
					app.object[object.id] = object;
				}

			return object;
		}
	},

	draw: function (redraw) {
		let drawed = {};

		if (redraw == 1) { delete app.drawed; }

		for (let id in app.object) {
			if (app.object[id].z != undefined) {
				if (drawed[app.object[id].z] == undefined) { drawed[app.object[id].z] = {}; }
				drawed[app.object[id].z][id] = app.object[id];
			}
		}

		for (let z in drawed) {
			for (let id in drawed[z]) {
				if (app.drawed == undefined) { app.drawed = {}; }
				if (app.drawed[z] == undefined) { app.drawed[z] = {}; }
				if (app.drawed[z][id] == undefined) { app.drawed[z][id] = {}; }

				if (app.get.hash (drawed[z][id]) != app.drawed[z][id]) {
					drawed[z][id].redraw = 0;
					drawed[z][id].draw ();
					app.drawed[z][id] = app.get.hash (drawed[z][id]);
				}
			}
		}
	},

	get: {
		ab: function (a, b) {
			return Math.sqrt (Math.pow (a.x - b.x, 2) + Math.pow (a.y - b.y, 2));
		},

		abr: function (a, b, r) {
			let ab = a.g.ab (a, b);
			let k = r / (ab - r);
			let x = (a.x + k * b.x) / (1 + k);
			let y = (a.y + k * b.y) / (1 + k);
			return { x: x, y: y };
		},

		boxinbox: function (a, b) {
			return ((Math.abs (a.x - b.x + 0.5 * (a.width - b.width)) < 0.5 * Math.abs (a.width + b.width)) && (Math.abs (a.y - b.y + 0.5 * (a.h - b.h)) < 0.5 * Math.abs (a.h + b.h)));
		},

		hash: function (object) {
			let src = (object.i) ? object.i.src : 0;
			return '' + object.color + object.height + object.redraw + object.text + object.width + object.x + object.y + object.z + src;
		},

		pointinbox: function (p, b) {
			return ((p.x > b.x) && (p.x < b.x + b.width) && (p.y > b.y) && (p.y < b.y + b.height));
		},

		random: function (a, b, c) {
			if (Array.isArray (a)) {
				let i = Math.floor (Math.random () * (a.length));
				return a[i];
			}

			if (a == 'color') {
				return '#' + ((1<<24)*Math.random()|0).toString(16);
			}

			if (c) {
				return Math.floor (Math.random () * (b - a + 1)) + a;
			}

			if (b) {
				return Math.random () * (b - a) + a;
			}

			return Math.random ();
		}
	},

	id: 0,

	load: function () {
		window.load (app.update);
		canvas.load ();
	},

	object: {},

	update: function (event) {
		for (let id in app.object) {
			for (let method in app.object[id]) {
				if (method == event.type) { app.object[id][method] (event); }
			}
		}
	},

	wipe: function () {
		app.object = {};
		canvas.style.cursor = 'default';
		context.clearRect (0, 0, canvas.width, canvas.height);
	},

	z: function (object) {
		for (let id in app.object) {
			if (id != object.id) {
				if (app.get.boxinbox (object, app.object[id])) {
					if (!app.object[id].redraw) {
						app.object[id].redraw = 1;
						app.z (app.object[id]);
					}
				}
			}
		}
	}
}
