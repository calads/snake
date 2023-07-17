const myCanvas = document.getElementById('myCanvas');
const context = myCanvas.getContext('2d');

const SIZE = 20;

const head = {x: 0, y: 0 };
const body = [];

let food = null; // x: y: 

let dx = 0;
let dy = 0;

let lastAxis; // 'Y' , 'X'

setInterval(main, 500);// 1000ms = 1s

function main(){
	update(); // actualizar las variables del juego
	draw(); // dibujar todos los objetos del juego
}

function update(){
	const collisionDetected = checkSnakeCollision();
	if (collisionDetected){
		gameOver();
		return;
	}

	//guardar la posición previa del último elemento de la cobra
	let prevX, prevY;
	if(body.length >= 1){
		prevX = body[body.length-1].x;
		prevY = body[body.length-1].y;
	} else{
		prevX = head.x;
		prevY = head.y;
	}

	// cuerpo sigue a la cabeza
	for (let i=body.length-1; i>=1; --i){
		body[i].x = body[i-1].x; //elem 1 <- elem 0
		body[i].y = body[i-1].y;
	}
	if(body.length >= 1){
	body[0].x = head.x;
	body[0].y = head.y;
	}

	// actualiza coordenadas cabeza de la serpiente
    head.x += dx;
	head.y += dy;
	// determinamos en que eje ha ocurrido el último mov
	if (dx !== 0){
		lastAxis = 'X';
	}else if(dy !== 0){
		lastAxis = 'Y';
	}



	//detectar si serpiente comió la pepa
		if(food && head.x === food.x && head.y === food.y){
			food = null;
			// aumentar tamanho da cobra
			increaseSnakeSize(prevX, prevY);
		}


	// generar la pepa en caso que no exista
	if (!food) {
		food = randomFoodPosition();
	}
}

function checkSnakeCollision(){
	// coordenadas de la cabeza sean iguales a las coord de un elem del cuerpo
	for (let i=0; i<body.length; ++i){
		if(head.x == body[i].x && head.y == body[i].y) {
			return true;
		}
	}

	// los límites del campo
	const topCollision = (head.y < 0); // x:? , y:0
	const bottomCollision = (head.y > 440); // x:? , y:460
	const rightCollision = (head.x < 0); // x:0 ; y:?
	const leftCollision = (head.x > 380); // x:400 , y:?

	if (topCollision || bottomCollision || leftCollision || rightCollision){
		return true;
	}
	return false;
}

function gameOver(){
	alert('Perdiste');
		head.x = 0;
		head.y = 0;
		dy = 0; dx = 0;
		body.length = [];
}

function increaseSnakeSize(prevX, prevY){
	body.push({
		x: prevX, y: prevY
	});
}

function randomFoodPosition(){
	let position;
	do {
		position = {x: getRandomX(), y: getRandomY()};
	} while(checkFoodCollision(position));
	return position;
}

function checkFoodCollision(position){
	// comparar  coord del alimento generado con el cuerpo de la cobra
	for (let i=0; i<body.length; ++i){
		if(position.x == body[i].x && position.y == body[i].y) {
			return true;
		}
	}

	// comparar las coord del alimento generado con la cabeza de la cobra
	if(position.x == head.x && position.y == head.y){
		return true;
	}

	return false;
}

function getRandomX(){
	//0,20,40, ..., 380
	//0,1,2, ...,19  (*20)
	return 20 * (parseInt(Math.random() *20));
}

function getRandomY(){
	//0,20,40, ..., 440
	//0,1,2, ...,22
	return 20 * (parseInt(Math.random() *23));
}

function draw() {
	// definir un fondo negro
	context.fillStyle = 'black';
	context.fillRect(0,0, myCanvas.width, myCanvas.height);
	
	// cabeza
	drawObject(head, 'green');

	// cuerpo
	body.forEach(
			elem => drawObject(elem, 'green')
		);

	// alimento
	drawObject(food, 'white');
}


function drawObject(obj, color){
	context.fillStyle = color;
	context.fillRect(obj.x, obj.y, SIZE, SIZE);
}

document.addEventListener('keydown', moveSnake);

function moveSnake(event) {
	switch(event.key) {
		case 'ArrowUp':	
			if (lastAxis !== 'Y') {
				dx = 0;
				dy = -SIZE;
				console.log('Mover hacia arriba');
			}
			break;
		case 'ArrowDown':
			if (lastAxis !== 'Y') {
				dx = 0;
				dy = +SIZE;
				console.log('Mover hacia abajo');
			}
			break;
		case 'ArrowRight':
			if (lastAxis !== 'X'){ 
				dx = +SIZE;
				dy = 0;
				console.log('Mover a la derecha');
			}
			break;
		case 'ArrowLeft':
			if (lastAxis !== 'X') { 
				dx = -SIZE;
				dy = 0;
				console.log('Mover a la izquierda');
			}
			break;
	}
}