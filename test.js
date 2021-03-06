//CREATE OBJECTS
app.scene.load = function () { app.scene.test (); }

app.scene.test = function ()
{
	app.wipe ();
	app.z = 1;

	let bar = app.create.bar ({ color: '#00f', height: 10, max: 100, now: 75, width: 500, x: 100, y: 400 }); bar.load ();

	let bar_text = app.create.text ({ color: '#00f', size: 20, text: bar.now + ' / ' + bar.max, x: 100, y: 390 });  bar_text.load ();

	let minus = app.create.button
	({
		action: function ()
		{
			bar.add (-7);
			bar_text.write (bar.now + ' / ' + bar.max);
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
			bar_text.write (bar.now + ' / ' + bar.max);
			app.draw ();
		},
		height: 10,
		i: 'plus',
		width: 10,
		x: 630,
		y: 400
	}).load ();

	app.create.box ({ color: '#f00', height: 100, width: 100, x: 100, y: 100, z: 1 }).load ();
	app.create.box ({ color: '#ff0', height: 100, width: 100, x: 150, y: 150 }).load ();

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
		y: 0.5 * window.innerHeight,
		z: 1
	}).load ();

	app.create.sprite ({ height: 100, i: 'logo', width: 100, x: 300, y: 100 }).load ();

	app.create.sprite ({ animation: { a: app.a.color, loop: function () { return 1; }, tick: 200 }, height: 100, width: 100, x: 700, y: 100 }).load ();

	app.create.text ({ color: '#fff', size: 24, text: 'text', width: 50, x: 400, y: 300 }).load ();

	app.draw ();
}

app.scene.test2 = function ()
{
	app.wipe ();
	app.z = 2;

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
		z: 2
	}).load ();

	let kx = 0.2;
	let ky = 0.2;

	for (let x = 0; x < 1; x += kx)
	{
		for (let y = 0; y < 1; y += ky)
		{
			app.create.box
			({
				color: '#000',
				height: ky * window.innerHeight,
				width: kx * window.innerWidth,
				x: x * window.innerWidth,
				y: y * window.innerHeight,
			}).load ();			
		}		
	}

	for (let i = 0; i < 10; i++)
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
			i: app.a.grass[0],
			width: 9,
			x: app.get.random () * window.innerWidth,
			y: app.get.random () * window.innerHeight,
			z: 1
		}).load ();
	}

	app.draw ();
}

app.scene.gold_snow = function ()
{
	app.wipe ();
	app.z = 1;

	let kx = 0.1;
	let ky = 0.1;

	for (let x = 0; x < 1; x += kx)
	{
		for (let y = 0; y < 1; y += ky)
		{
			app.create.box
			({
				color: '#000',
				height: ky * window.innerHeight,
				width: kx * window.innerWidth,
				x: x * window.innerWidth,
				y: y * window.innerHeight,
			}).load ();			
		}		
	}

	let boxes = 10;

	let cycle = app.create.cycle
	({
		action: function ()
		{
			let create = (app.get.random () < 0.1) ? 1 : 0;

			if ((create) && (50 > boxes))
			{
				let y0 = app.get.random () * window.innerHeight;
				app.create.box ({ color: '#fff', height: 10, name: 'snowflake', width: 10, x: 0, y: y0, z: 1 }).load ();
				boxes++;
			}

			let snowflakes = app.get.objects ('name', 'snowflake');

			for (let id in snowflakes)
			{
				let gravity = Math.sin (snowflakes[id].x) * 0.01 * window.innerHeight;
				let speed = app.get.random (0, 0.5) * 0.01 * window.innerWidth;
				let bright = 200 + Math.sin (snowflakes[id].x) * 56;

				//snowflakes[id].color = 'rgb(' + bright + ', ' + bright + ', 0)';

				//snowflakes[id].color = ;

				if (snowflakes[id].x + speed + snowflakes[id].width <= window.innerWidth)
				{
					snowflakes[id].x += speed;
				}
				else
				{
					boxes--;
					delete app.object[id];
				}

				if (snowflakes[id].y + gravity + snowflakes[id].height <= window.innerHeight)
				{
					snowflakes[id].y += gravity;
				}
				else
				{
					boxes--;
					delete app.object[id];
				}

				if (app.object[id])
				{
					app.object[id].move (snowflakes[id].x, snowflakes[id].y);
				}
			}
		},
		period: 25,
	}); cycle.load ();

	app.draw ();
}
