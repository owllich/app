//CREATE OBJECTS
app.scene.load = function () { app.scene.test (); }

app.scene.test = function ()
{
	app.wipe ();

	let bar = app.create.bar ({ color: '#00f', height: 10, max: 100, now: 75, width: 500, x: 100, y: 400 });
		bar.load ();

	let bar_text = app.create.text ({ color: '#00f', size: 20, text: bar.now + ' / ' + bar.max, x: 100, y: 390 });
		bar_text.load ();

	let minus = app.create.button
	({
		action: function ()
		{
			bar.add (-7);
			bar_text.text = bar.now + ' / ' + bar.max;
			app.draw ();
		},
		height: 10,
		i: 'minus',
		width: 10,
		x: 610,
		y: 400
	}).load ();

	let plus = app.create.button
	({
		action: function ()
		{
			bar.add (3);
			bar_text.text = bar.now + ' / ' + bar.max;
			app.draw ();
		},
		height: 10,
		i: 'plus',
		width: 10,
		x: 630,
		y: 400
	}).load ();

	app.create.box ({ color: '#f00', height: 100, width: 100, x: 100, y: 100, z: 1 }).load ();
	app.create.box ({ color: '#ff0', height: 100, width: 100, x: 150, y: 150, z: 0 }).load ();

	app.create.button
	({
		action: function ()
		{
			app.scene.test2 ();
		},
		height: 60,
		i: 'forward',
		width: 60,
		x: 0.6 * window.innerWidth,
		y: 0.5 * window.innerHeight
	}).load ();

	app.create.sprite ({ height: 100, i: 'logo', width: 100, x: 300, y: 100 }).load ();

	app.create.sprite ({ animation: { a: app.a.color, loop: function () { return 1; }, tick: 200 }, height: 100, width: 100, x: 700, y: 100 }).load ();

	app.create.text ({ color: '#fff', size: 24, text: 'text', width: 50, x: 400, y: 300 }).load ();

	app.draw ();
}

app.scene.test2 = function ()
{
	app.wipe ();

	app.create.button
	({
		action: function ()
		{
			app.scene.test ();
		},
		height: 60,
		i: 'back',
		width: 60,
		x: 0.6 * window.innerWidth,
		y: 0.5 * window.innerHeight,
		z: 1
	}).load ();

	let black = app.create.sprite
	({
		height: window.innerHeight,
		i: 'black',
		redraw: 1,
		width: window.innerWidth,
		x: 0,
		y: 0
	});
	black.load ();

	for (let i = 0; i < 100; i++)
	{
		app.create.sprite
		({
			animation:
			{
				a: app.a.grass,
				loop: () => 1,
				step: app.get.random (0, 4, 1),
				tick: app.get.random (100, 500, 1)
			},
			height: 6,
			width: 9,
			x: app.get.random () * window.innerWidth,
			y: app.get.random () * window.innerHeight
		}).load ();
	}

	app.draw ();
}
