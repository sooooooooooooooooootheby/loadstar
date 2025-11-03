const { Server } = require("socket.io");
const { getInformation } = require("./monitoring.js");
const { getPm2Info } = require("./pm2.js");

const SOCKETPORT = 3000;

const io = new Server(SOCKETPORT, {
	cors: {
		origin: "*",
	},
	path: "/",
});

io.on("connection", async (socket) => {
	io.emit("server", await getInformation());
	io.emit("pm2", await getPm2Info());

	const intervalServer = setInterval(async () => {
		socket.emit("server", await getInformation());
	}, 1000);
	const intervalPm2 = setInterval(async () => {
		socket.emit("pm2", await getPm2Info());
	}, 6000);

	const timeout = setTimeout(() => {
		clearInterval(intervalServer);
		clearInterval(intervalPm2);
	}, 10 * 60 * 1000);

	socket.on("disconnect", () => {
		clearInterval(intervalServer);
		clearInterval(intervalPm2);
		clearTimeout(timeout);
	});
});

console.clear();
console.log(`server running at http://localhost:${SOCKETPORT}`);
console.log(`test: "curl 'http://localhost:${SOCKETPORT}/socket.io/?EIO=4&transport=polling' -v"`);
