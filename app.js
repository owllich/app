var window = window;
	window.tick = 25;
	window.time = 0;

	window.load = function (update)
	{
		window.onmousedown = update;
		window.onmousemove = update;
		window.onmouseup = update;
		window.onresize = function (event) { canvas.resize (); update (event); app.draw (1); };
		window.ontick (update);
	}

	window.ontick = function (update)
	{
		window.setInterval
		(
			function ()
			{
				window.time += window.tick;
				update ({ type: 'tick' });
				app.draw ();
			},
			window.tick
		);
	}

var canvas = window.document.createElement ('canvas');

	canvas.load = function ()
	{
		canvas.style.left = 0;
		canvas.style.position = 'absolute';
		canvas.style.top = 0;
		canvas.resize ();
		window.document.body.appendChild (canvas);
	}

	canvas.resize = function ()
	{
		canvas.height = window.innerHeight;
		canvas.width = window.innerWidth;
	}

var context = canvas.getContext ('2d');

var app =
{
	a: {},

	create:
	{
		bar: function (_)
		{
			let bar = app.create.box (_);
				bar.max = _.max || 1;
				bar.now = _.now || 0;
				bar.old = undefined;

				bar.draw = function ()
				{
					let hwxy = app.get.hwxy (bar);
					let k = bar.now / bar.max;
					if (bar.color) { context.fillStyle = bar.color; context.strokeStyle = bar.color; }
					context.clearRect (hwxy.x, hwxy.y, hwxy.width, hwxy.height);
					context.fillRect (hwxy.x, hwxy.y, k * hwxy.width, hwxy.height);
					context.strokeRect (hwxy.x, hwxy.y, hwxy.width, hwxy.height);
				}

				bar.add = function (n)
				{
					if (bar.now + n < 0)
					{
						bar.now = 0;
					} else if (bar.now + n > bar.max)
					{
						bar.now = bar.max;
					} else
					{
						bar.now += n;
					}
				}

				bar.status = function ()
				{
					if (bar.now != bar.old)
					{
						bar.old = bar.now;
						bar.draw ();
					}
				}

				bar.tick = function ()
				{
					bar.status ();
				}

			return bar;
		},

		box: function (_)
		{
			let box = app.create.object (_);
				box.redraw = _.redraw || 1;
				box.trace = {};
				box.z = _.z || 0;

				box.draw = function ()
				{
					let hwxy = app.get.hwxy (box);
					if (box.color) { context.fillStyle = box.color; }
					context.fillRect (hwxy.x, hwxy.y, hwxy.width, hwxy.height);
				}

				box.move = function (x, y)
				{
					box.redraw = 1;
					app.draw ();
					box.x = x;
					box.y = y;
					box.redraw = 1;
					app.zen (box);
					box.tracing ();
					app.draw ();
				}

				box.tracing = function ()
				{
					for (let id in app.object)
					{
						if (app.object[id].draw)
						{
							if (box.trace[id] == 1)
							{
								if (!app.get.boxinbox (box, app.object[id]))
								{
									app.object[id].redraw = 1;
									//app.zen (app.object[id]);
								}
							}

							if (app.get.boxinbox (box, app.object[id]))
							{
								box.trace[id] = 1;
							} else
							{
								box.trace[id] = 0;
							}
						}
					}
				}

			return box;
		},

		button: function (_)
		{
			let button = app.create.sprite (_);
				button.action = _.action || function () {};
				button.in = _.in || function () {};
				button.out = _.out || function () {};
				button.over = 0;

				button.active = function (event)
				{
					if (button.over)
					{
						if (!app.get.pointinbox ({ x: event.x, y: event.y }, button))
						{
							button.over = 0;
							canvas.style.cursor = 'default';
							button.out ();
						}
					} else
					{
						if (app.get.pointinbox ({ x: event.x, y: event.y }, button))
						{
							button.over = 1;
							canvas.style.cursor = 'pointer';
							button.in ();
						}
					}
				}

				button.mousedown = function (event)
				{
					if (app.get.pointinbox ({ x: event.x, y: event.y }, button))
					{
						button.action ();
					}
				}

				button.mousemove = function (event)
				{
					button.active (event);
				}

				button.mouseup = function (event)
				{
					button.over = 0;
					button.active (event);
				}

			return button;
		},

		cycle: function (_) {
			let cycle = app.create.object (_);
				cycle.action = _.action || function () {};
				cycle.ok = _.ok || 1;
				cycle.period = _.period || window.period;
				cycle.time = _.time || window.time;

				cycle.run = function ()
				{
					if (cycle.ok)
					{
						if (window.time - cycle.time >= cycle.period)
						{
							cycle.time = window.time;
							cycle.action ();
						}
					}
				}

				cycle.tick = function ()
				{
					cycle.run ();
				}

			return cycle;
		},

		object: function (_)
		{
			let object = _ || {};
				object.id = _.id || app.id++;
				object.tag = _.tag || [];

				object.load = function ()
				{
					app.object[object.id] = object;
				}

			return object;
		},

		sprite: function (_)
		{
			let sprite = app.create.box (_);
				sprite.aa = _.aa || 0;
				sprite.i = app.get.i (_.i);

				sprite.animate = function ()
				{
					if (typeof (sprite.animation) == 'object')
					{
						if (sprite.animation.loop ())
						{
							sprite.animation.step = (sprite.animation.step) ? sprite.animation.step : 0;
							sprite.animation.tick = (sprite.animation.tick) ? sprite.animation.tick : window.tick;
							sprite.animation.time = (sprite.animation.time) ? sprite.animation.time : window.time;
							if (window.time - sprite.animation.time >= sprite.animation.tick)
							{
								sprite.animation.time = window.time;
								sprite.animation.step = (sprite.animation.step >= sprite.animation.a.length - 1) ? 0 : sprite.animation.step + 1;
								sprite.i = sprite.animation.a[sprite.animation.step];
								sprite.redraw = 1;
								app.zen (sprite);
							}
						}
					}
				}

				sprite.draw = function ()
				{
					let hwxy = app.get.hwxy (sprite);
					context.imageSmoothingEnabled = sprite.aa;
					context.drawImage (sprite.i, hwxy.x, hwxy.y, hwxy.width, hwxy.height);
				}

				sprite.tick = function ()
				{
					sprite.animate ();
				}

			return sprite;
		},

		text: function (_)
		{
			let text = app.create.box (_);
				text.font = _.font || 'Arial';
				text.max_width = context.measureText (text.text).width;
				text.size = _.size || 12;
				text.text = _.text || '';

				text.autosize = function ()
				{
					if (text.width)
					{
						let hwxy = app.get.hwxy (text);

						context.font = text.size + 'px ' + text.font;

						while (Math.abs (hwxy.width - context.measureText (text.text).width) > 1)
						{
							if (context.measureText (text.text).width > hwxy.width)
							{
								text.size = 0.8 * text.size;
							} else
							{
								text.size = 1.2 * text.size;
							}
							context.font = text.size + 'px ' + text.font;
						}
					}
				}

				text.draw = function ()
				{
					let hwxy = app.get.hwxy (text);

					text.autosize ();

					if (text.color)
					{
						context.fillStyle = text.color;
					}

					context.font = text.size + 'px ' + text.font;

					text.max_width = (context.measureText (text.text).width > text.max_width) ? context.measureText (text.text).width : text.max_width;

					let width = (text.width) ? text.width : text.max_width;
					context.clearRect (hwxy.x, hwxy.y - text.size, width, text.size);
					context.fillText (text.text, hwxy.x, hwxy.y);
				}

				text.resize = function ()
				{
					text.autosize ();
				}

				text.write = function (value)
				{
					text.text = value;
					text.redraw = 1;
				}

			text.autosize ();

			return text;
		}
	},

	draw: function (redraw)
	{
		for (let z = 0; z <= app.z; z++)
		{
			for (let id in app.object)
			{
				if (app.object[id].z == z)
				{
					if (app.object[id].redraw || redraw)
					{
						app.object[id].redraw = 0;
						app.object[id].draw ();
					}
				}
			}
		}
	},

	get:
	{
		ab: function (a, b)
		{
			return Math.sqrt (Math.pow (a.x - b.x, 2) + Math.pow (a.y - b.y, 2));
		},

		abr: function (a, b, r)
		{
			let ab = a.g.ab (a, b);
			let k = r / (ab - r);
			let x = (a.x + k * b.x) / (1 + k);
			let y = (a.y + k * b.y) / (1 + k);
			return { x: x, y: y };
		},

		animations: function (a)
		{
			for (id in a)
			{
				app.a[id] = [];
				for (let i = 0; i < a[id]; i++)
				{
					let image = new Image ();
						image.src = 'data/' + id + ' ' + i + '.png';
						app.a[id].push (image);
				}
			}
		},

		boxinbox: function (a, b)
		{
			return ((Math.abs (a.x - b.x + 0.5 * (a.width - b.width)) < 0.5 * Math.abs (a.width + b.width)) && (Math.abs (a.y - b.y + 0.5 * (a.height - b.height)) < 0.5 * Math.abs (a.height + b.height)));
		},

		count: function (property, value)
		{
			let count = 0;
			for (let id in app.object)
			{
				if (app.object[id][property] == value) { count++; }
			}
			return count;
		},

		hash: function (object)
		{
			let src = (object.i) ? object.i.src : 0;
			return '' + object.color + object.height + object.now + object.redraw + object.text + object.width + object.x + object.y + object.z + src;
		},

		hwxy: function (object)
		{
			let hwxy = {};

				if (object.height)
				{
					hwxy.height = app.get.y (object.height);
				}

				if (object.width)
				{
					hwxy.width = app.get.x (object.width);
				}

				hwxy.height = (hwxy.height) ? hwxy.height : hwxy.width;
				hwxy.width = (hwxy.width) ? hwxy.width : hwxy.height;

				hwxy.x = object.x || 0;
				hwxy.x = app.get.x (hwxy.x);

				hwxy.y = object.y || 0;
				hwxy.y = app.get.y (hwxy.y);

			return hwxy;
		},

		i: function (i)
		{
			let image = (typeof (i) == 'object') ? i : app.i[i];
				image = (image) ? image : new Image ();
			return image;
		},

		images: function (i)
		{
			for (let n of i)
			{
				let image = new Image ();
					image.src = 'data/' + n + '.png';
				app.i[n] = image;
			}
		},

		objects: function (property, value)
		{
			let objects = {};
			for (let id in app.object)
			{
				if (app.object[id][property] == value) { objects[id] = app.object[id]; }
			}
			return objects;
		},

		pointinbox: function (p, b)
		{
			return ((p.x > b.x) && (p.x < b.x + b.width) && (p.y > b.y) && (p.y < b.y + b.height));
		},

		random: function (a, b, c)
		{
			if (Array.isArray (a))
			{
				let i = Math.floor (Math.random () * (a.length));
				return a[i];
			}

			if (a == 'color')
			{
				return '#' + ((1<<24)*Math.random()|0).toString(16);
			}

			if (c)
			{
				return Math.floor (Math.random () * (b - a + 1)) + a;
			}

			if (b)
			{
				return Math.random () * (b - a) + a;
			}

			return Math.random ();
		},

		x: function (x)
		{
			return (x > 0 && x <= 1) ? x * window.innerWidth : x;
		},

		y: function (y)
		{
			return (y > 0 && y <= 1) ? y * window.innerHeight : y;
		}
	},

	i: {},

	id: 0,

	load: function ()
	{
		window.load (app.update);
		canvas.load ();
		app.scene.load ();
	},

	object: {},

	scene:
	{
		load: function () {}
	},

	update: function (event)
	{
		for (let id in app.object)
		{
			for (let method in app.object[id])
			{
				if (method == event.type) { app.object[id][method] (event); }
			}
		}
	},

	wipe: function ()
	{
		app.object = {};
		canvas.style.cursor = 'default';
		context.clearRect (0, 0, canvas.width, canvas.height);
	},

	z: 0,

	zen: function (object)
	{
		for (let id in app.object)
		{
			if ((app.object[id].redraw != 1) && (app.object[id].z != object.z))
			{
				if (app.get.boxinbox (object, app.object[id]))
				{
					app.object[id].redraw = 1;
					app.zen (app.object[id]);
				}
			}
		}
	}
}

window.onload = app.load;
