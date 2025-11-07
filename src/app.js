const { Server } = require("socket.io");
const { getInformation } = require("./monitoring.js");
const { getPm2Info } = require("./pm2.js");
const minimist = require("minimist");

const argv = minimist(process.argv.slice(2));
const SOCKETPORT = argv.port || 3000;
const SERVERTIME = argv.st || 1000;
const PM2TIME = argv.pt || 6000;
const TIMEOUT = argv.to || 600000;

const io = new Server(SOCKETPORT, {
	cors: {
		origin: "*",
	},
	path: "/",
});

console.clear();
console.log(`server running at http://localhost:${SOCKETPORT}`);
console.log(`test: "curl 'http://localhost:${SOCKETPORT}/socket.io/?EIO=4&transport=polling' -v"`);
console.log(`
- Server time: ${SERVERTIME / 1000}s,
- Pm2 time: ${PM2TIME / 1000}s,
- timeout: ${TIMEOUT / 1000}s,
`);

let userCount = 0;

io.on("connection", async (socket) => {
	userCount++;
	console.log(`client <${socket.id}> join, The current number of connections is ${userCount}`);

	io.emit("server", await getInformation());
	io.emit("pm2", await getPm2Info());

	const intervalServer = setInterval(async () => {
		socket.emit("server", await getInformation());
	}, SERVERTIME);
	const intervalPm2 = setInterval(async () => {
		socket.emit("pm2", await getPm2Info());
	}, PM2TIME);

	const timeout = setTimeout(() => {
		clearInterval(intervalServer);
		clearInterval(intervalPm2);
	}, TIMEOUT);

	socket.on("disconnect", () => {
		userCount--;
		console.log(`client <${socket.id}> disconnect, The current number of connections is ${userCount}`);

		clearInterval(intervalServer);
		clearInterval(intervalPm2);
		clearTimeout(timeout);
	});
});
