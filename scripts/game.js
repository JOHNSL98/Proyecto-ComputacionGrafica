// --------------------------------------------- //
// ------ Juego Air Hockey with Three.JS ------- //
// --------- Creado por John Suarez ------------ //
// -------- Three.JS is by Mr. doob  ----------- //
// --------------------------------------------- //

// variables de objeto de escena
var renderer, scene, camera, pointLight, spotLight;

// variables de campo
var fieldWidth = 400, fieldHeight = 200;

// variables de las paletas
var paddleWidth, paddleHeight, paddleDepth, paddleQuality;
var paddle1DirY = 0, paddle2DirY = 0, paddleSpeed = 3, paddle1DirX = 0, paddle2DirX = 0;

// variables del disco
var ball, paddle1, paddle2, cancha1, cancha2;
var ballDirX = 1, ballDirY = 1, ballSpeed = 2;

// Variables marcadores => 0 - debideamente por marcadores iniciales
var score1 = 0, score2 = 0;
// Numero de puntos para que un jugador gane
var maxScore = 7;

// Dificultad oponente (0 - más fácil, 1 - más difícil)
var difficulty = 0.2;

// ------------------------------------- //
// ------- GAME FUNCTIONS -------------- //
// ------------------------------------- //

function setup()
{
	// actualizar el tablero para reflejar la puntuación máxima para ganar partidos
	document.getElementById("winnerBoard").innerHTML = "First to " + maxScore + " wins!";
	
	// Reiniciar marcadores
	score1 = 0;
	score2 = 0;
	
	// Configurar los objetos de la escena - juego
	createScene();
	
	// iniciar juego!
	draw();
}

function createScene()
{
	// Tamaño de la escena
	var WIDTH = 640,
	  HEIGHT = 360;

	// Atributos de la camara
	var VIEW_ANGLE = 50,
	  ASPECT = WIDTH / HEIGHT,
	  NEAR = 0.1,
	  FAR = 10000;

	var c = document.getElementById("gameCanvas");

	// crear un renderizador WebGL, cámara y una escena
	renderer = new THREE.WebGLRenderer();
	camera =
	  new THREE.PerspectiveCamera(
		VIEW_ANGLE,
		ASPECT,
		NEAR,
		FAR);

	scene = new THREE.Scene();

	// agrega la cámara a la escena
	scene.add(camera);
	
	// establecer una posición predeterminada para la cámara
	camera.position.z = 320;
	
	// iniciar el renderizador
	renderer.setSize(WIDTH, HEIGHT);

	// adjuntar el elemento DOM proporcionado por el render
	c.appendChild(renderer.domElement);

	// configurar el plano de superficie de juego
	var planeWidth = fieldWidth,
		planeHeight = fieldHeight,
		planeQuality = 10;
		
	// crear el material de la paleta 1
	var paddle1Material =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x1B32C0
		});
	// crear el material de la paleta 2
	var paddle2Material =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0xFF0000
		});
	//  crea el material del plano
    var texturaFondo =  THREE.ImageUtils.loadTexture("textures/cancha.png");
	var tableMaterial =
	  new THREE.MeshLambertMaterial(
		{
		   map: texturaFondo
		});
	// crear el material del suelo
	var groundMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x888888
		});
    // crear el material de las canchas
    var canchaMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x101010
		});
		
		
	// crea el plano de superficie de juego
	
	var table = new THREE.Mesh(

	  new THREE.CubeGeometry(
		planeWidth * 1.05,	// esto crea la sensación de una mesa de billar, con un forro
		planeHeight * 1.03,
		100,				// una profundidad arbitraria, la cámara no puede ver mucho de todos modos
		planeQuality,
		planeQuality,
		1),

	  tableMaterial);
	table.position.z = -51;	// se hunde la mesa en el suelo por 50 unidades. El extra 1 es para que se vea el plano.
	scene.add(table);
	table.receiveShadow = true;	
		
	// configurar las variables esfera
	// Los valores más bajos de 'segmento' y 'anillo' aumentarán el rendimiento
	var radius = 5,
		segments = 6,
		rings = 6;
		
	// crear el material de la esfera
	var sphereMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0xD43001
		});
		
	// Crea una bola con geometría de esfera.
	ball = new THREE.Mesh(

	  new THREE.SphereGeometry(
		radius,
		segments,
		rings),

	  sphereMaterial);

	// añadir la esfera a la escena
	scene.add(ball);
	
	ball.position.x = 0;
	ball.position.y = 0;
	// coloca la bola sobre la superficie de la mesa
	ball.position.z = radius;
	ball.receiveShadow = true;
    ball.castShadow = true;
	
	// configurar las variables de paletas
	paddleWidth = 10;
	paddleHeight = 30;
	paddleDepth = 10;
	paddleQuality = 1;
		
	paddle1 = new THREE.Mesh(

	  new THREE.CubeGeometry(
		paddleWidth,
		paddleHeight,
		paddleDepth,
		paddleQuality,
		paddleQuality,
		paddleQuality),

	  paddle1Material);

	// añadir la paleta 1 a la escena
	scene.add(paddle1);
	paddle1.receiveShadow = true;
    paddle1.castShadow = true;
	
	paddle2 = new THREE.Mesh(

	  new THREE.CubeGeometry(
		paddleWidth,
		paddleHeight,
		paddleDepth,
		paddleQuality,
		paddleQuality,
		paddleQuality),

	  paddle2Material);
	  
	// añadir la paleta 2 a la escena
	scene.add(paddle2);
	paddle2.receiveShadow = true;
    paddle2.castShadow = true;	
	
	// establecer paletas en cada lado de la mesa
	paddle1.position.x = -165;
	paddle2.position.x = fieldWidth/2 - paddleWidth;
	
	// poner las paletas sobre la superficie de la mesa
	paddle1.position.z = paddleDepth;
	paddle2.position.z = paddleDepth;
		
    cancha1 = new THREE.Mesh(

	  new THREE.CubeGeometry(
		10,
		35,
		paddleDepth),

	  canchaMaterial);
    
    cancha2 = new THREE.Mesh(

	  new THREE.CubeGeometry(
		10,
		35,
		paddleDepth),

	  canchaMaterial);
	  
	// añadir la cancha 1 a la escena
	scene.add(cancha1);
    scene.add(cancha2);
    
    // establecer canchas en cada lado de la mesa
	cancha1.position.x = -173;
    cancha1.position.y = -1;
	cancha2.position.x = 173;
    cancha2.position.y = -1;
	
	// poner las canchas sobre la superficie de la mesa
	cancha1.position.z = paddleDepth;
	cancha2.position.z = paddleDepth;
	
    
	// finalmente terminamos agregando un plano de tierra
	// para mostrar sombras 
	var ground = new THREE.Mesh(

	  new THREE.CubeGeometry( 
	  1000, 
	  1000, 
	  3, 
	  1, 
	  1,
	  1 ),

	  groundMaterial);
    // establecer el terreno en la posición z arbitraria para mostrar mejor la sombra
	ground.position.z = -132;
	ground.receiveShadow = true;	
	scene.add(ground);		
		
	// crear una luz puntual
	pointLight =
	  new THREE.PointLight(0xF8D898);

	// establecer su posición
	pointLight.position.x = -1000;
	pointLight.position.y = 0;
	pointLight.position.z = 1000;
	pointLight.intensity = 2.9;
	pointLight.distance = 10000;
	// añadir a la escena
	scene.add(pointLight);
		
	// añade un foco de luz
	// esto es importante para proyectar sombras
    spotLight = new THREE.SpotLight(0xF8D898);
    spotLight.position.set(0, 0, 460);
    spotLight.intensity = 1.5;
    spotLight.castShadow = true;
    scene.add(spotLight);
    
	renderer.shadowMapEnabled = true;		
}

function draw()
{	
	// dibujar escena THREE.JS
	renderer.render(scene, camera);
	// llamada a la función de dibujo
	requestAnimationFrame(draw);
	
	ballPhysics();
	paddlePhysics();
	cameraPhysics();
	playerPaddleMovement();
	opponentPaddleMovement();
}

function ballPhysics()
{
	// si la bola sale del lado 'izquierdo' (lado del jugador)
	if (ball.position.x <= -173 && ball.position.y == 0)
	{	
		// puntajes de CPU
		score2++;
		// actualizar el marcador HTML
		document.getElementById("scores").innerHTML = score1 + "-" + score2;
		// restablecer la bola al centro
		resetBall(2);
		matchScoreCheck();	
	}
    
    // si la bola toca el lado izquierdo
    if (ball.position.x <= -173 && (ball.position.y > 0 || ball.position.y < 0))
	{	
		ballDirX = -ballDirX;	
	}
    
    // si la bola toca el lado derecho
    if (ball.position.x >= 173 && (ball.position.y > 0 || ball.position.y < 0))
	{	
		ballDirX = -ballDirX;	
	}
	
	// si la bola sale del lado 'derecho' (lado de la CPU)
	if (ball.position.x >= 173 && ball.position.y == 0)
	{	
		// puntajes de los jugadores
		score1++;
		// actualizar el marcador HTML
		document.getElementById("scores").innerHTML = score1 + "-" + score2;
		// restablecer la bola al centro
		resetBall(1);
		matchScoreCheck();	
	}
	
	// si la bola sale del lado superior (lado de la mesa)
	if (ball.position.y <= -fieldHeight/2)
	{
		ballDirY = -ballDirY;
	}	
	// si la bola sale del lado inferior (lado de la mesa)
	if (ball.position.y >= fieldHeight/2)
	{
		ballDirY = -ballDirY;
	}
	
	// actualizar la posición de la bola con el tiempo
	ball.position.x += ballDirX * ballSpeed;
	ball.position.y += ballDirY * ballSpeed;
	
	// actualizar la posición de la bola con el tiempo
	// esto es así que la bola no acelera de izquierda a derecha súper rápido
	if (ballDirY > ballSpeed * 2)
	{
		ballDirY = ballSpeed * 2;
	}
	else if (ballDirY < -ballSpeed * 2)
	{
		ballDirY = -ballSpeed * 2;
	}
}

// Maneja la lógica y el movimiento de la paleta de la CPU
function opponentPaddleMovement()
{
	// Lerp hacia la pelota en el plano y
	paddle2DirY = (ball.position.y - paddle2.position.y) * difficulty;
	
	// en caso de que la función Lerp produzca un valor por encima de la velocidad máxima de la paleta, la sujetamos
	if (Math.abs(paddle2DirY) <= paddleSpeed)
	{	
		paddle2.position.y += paddle2DirY;
	}
	// si el valor de lerp es demasiado alto, tenemos que limitar la velocidad a paddleSpeed
	else
	{
		// si la paleta está girando en dirección + ve
		if (paddle2DirY > paddleSpeed)
		{
			paddle2.position.y += paddleSpeed;
		}
		// si la paleta se desplaza en dirección de -ve
		else if (paddle2DirY < -paddleSpeed)
		{
			paddle2.position.y -= paddleSpeed;
		}
	}
	// Devolvemos la escala a 1.
	// Esto se hace porque estiramos la paleta en algunos puntos.
	// el estiramiento se realiza cuando la paleta toca el lado de la mesa y cuando la paleta golpea la bola
	// Al hacer esto aquí, nos aseguramos de que Paddle siempre vuelva a su tamaño predeterminado.
	paddle2.scale.y += (1 - paddle2.scale.y) * 0.2;	
    paddle2.position.x=165;
}

// Maneja el movimiento de la paleta del jugador.
function playerPaddleMovement()
{
	// mover a la izquierda
	if (Key.isDown(Key.A))		
	{
		// si la paleta no toca el lado de la mesa
		// nos movemos
		if (paddle1.position.y < fieldHeight * 0.45)
		{
			paddle1DirY = paddleSpeed * 0.5;
		}
		// de lo contrario no nos movemos y estiramos la paleta
		// para indicar que no podemos movernos
		else
		{
			paddle1DirY = 0;
		}
	}	
	// mover a la derecha
	else if (Key.isDown(Key.D))
	{
		if (paddle1.position.y > -fieldHeight * 0.45)
		{
			paddle1DirY = -paddleSpeed * 0.5;
		}
		else
		{
			paddle1DirY = 0;
		}
	}	
	// mover arriba
	else if (Key.isDown(Key.W))
	{
		if (paddle1.position.x < 0)
		{
			paddle1DirX = paddleSpeed * 0.5;
		}
		else
		{
			paddle1DirX = 0;
		}
	}
    // mover abajo
	else if (Key.isDown(Key.S))
	{
		if (paddle1.position.x > -165)
		{
			paddle1DirX = -paddleSpeed * 0.5;
		}
		else
		{
			paddle1DirX = 0;
		}
	}
	// de lo contrario no muevas la paleta
	else
	{
		// para la paleta
		paddle1DirY = 0;
        paddle1DirX = 0;
	}
	
	paddle1.scale.y += (1 - paddle1.scale.y) * 0.2;	
	paddle1.scale.z += (1 - paddle1.scale.z) * 0.2;	
    paddle1.position.y += paddle1DirY;
    paddle1.position.x += paddle1DirX;
}

// Maneja la cámara y la lógica de iluminación.
function cameraPhysics()
{
	// posicionar camara
	camera.position.x = 0;
	camera.position.y = 0;
	camera.position.z = 300;
}

// Maneja la lógica de colisión paleta.
function paddlePhysics()
{
	// LOGICA DE LA PALETA DEL JUGADOR
	
	// si la bola está alineada con paddle1 en el plano x
	// recuerda que la posición es el CENTRO del objeto
	// solo verificamos entre el frente y el medio de la paleta (colisión en un solo sentido)
	if (ball.position.x <= paddle1.position.x + paddleWidth
	&&  ball.position.x >= paddle1.position.x)
	{
		// y si la bola está alineada con paddle1 en el plano y
		if (ball.position.y <= paddle1.position.y + paddleHeight/2
		&&  ball.position.y >= paddle1.position.y - paddleHeight/2)
		{
			// y si la bola viaja hacia el jugador (dirección -ve)
			if (ballDirX < 0)
			{
				// cambiar la dirección del recorrido de la bola para crear rebote
				ballDirX = -ballDirX;
				// impactamos el ángulo de la bola cuando la golpeamos
				// esto no es física realista, solo condimenta el juego
				// te permite 'cortar' la pelota para vencer al oponente
				ballDirY -= paddle1DirY * 0.7;
			}
		}
	}
	
	// LOGICA PALETA CPU	
    
	if (ball.position.x <= paddle2.position.x + paddleWidth
	&&  ball.position.x >= paddle2.position.x)
	{
		if (ball.position.y <= paddle2.position.y + paddleHeight/2
		&&  ball.position.y >= paddle2.position.y - paddleHeight/2)
		{
			if (ballDirX > 0)
			{	
				ballDirX = -ballDirX;
				ballDirY -= paddle2DirY * 0.7;
			}
		}
	}
}

function resetBall(loser)
{
	// posiciona la pelota en el centro de la mesa
	ball.position.x = 0;
	ball.position.y = 0;
	
	// Si el jugador perdió el último punto, enviamos la pelota al oponente.
	if (loser == 1)
	{
		ballDirX = -1;
	}
	// de lo contrario si el oponente pierde, enviamos bola al jugador.
	else
	{
		ballDirX = 1;
	}
	
	// configura la bola para que se mueva + ve en el plano y (hacia la izquierda de la cámara)
	ballDirY = 1;
}

var bounceTime = 0;
// comprueba si el jugador o el oponente ha alcanzado 7 puntos
function matchScoreCheck()
{
	// si el jugador tiene 7 puntos
	if (score1 >= maxScore)
	{
		// parar el disco
		ballSpeed = 0;
		// escribir en el banner
		document.getElementById("scores").innerHTML = "Jugador Gana!";		
		document.getElementById("winnerBoard").innerHTML = "Actualice la pagina para jugar de nuevo";
		// hacer que la paleta rebote arriba y abajo
		bounceTime++;
		paddle1.position.z = Math.sin(bounceTime * 0.1) * 10;
		// Agrandar y aplastar la paleta para emular alegría.
		paddle1.scale.z = 2 + Math.abs(Math.sin(bounceTime * 0.1)) * 10;
		paddle1.scale.y = 2 + Math.abs(Math.sin(bounceTime * 0.05)) * 10;
	}
	// de lo contrario si el oponente tiene 7 puntos
	else if (score2 >= maxScore)
	{
		ballSpeed = 0;
        
		document.getElementById("scores").innerHTML = "CPU Gana!";
		document.getElementById("winnerBoard").innerHTML = "Actualice la pagina para jugar de nuevo";
        
		bounceTime++;
		paddle2.position.z = Math.sin(bounceTime * 0.1) * 10;
        
		paddle2.scale.z = 2 + Math.abs(Math.sin(bounceTime * 0.1)) * 10;
		paddle2.scale.y = 2 + Math.abs(Math.sin(bounceTime * 0.05)) * 10;
	}
}