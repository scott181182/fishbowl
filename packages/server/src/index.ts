import { createServer } from "./server";



const PORT = 3000;

const app = await createServer();

app.listen(PORT, "0.0.0.0", undefined, () => {
    console.log(`Server listening on port ${PORT}...`);
});
