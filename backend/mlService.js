import { spawn } from "child_process";
import path from "path";

export async function getRiskScore(transaction) {
    return new Promise((resolve, reject) => {
        const python = "python";

        const scriptPath = path.join(process.cwd(), "../fraudshield-ml/mlservice.py");

        const py = spawn(python, [scriptPath]);

        let output = "";
        let error = "";

        py.stdin.write(JSON.stringify(transaction));
        py.stdin.end();

        py.stdout.on("data", (data) => output += data.toString());
        py.stderr.on("data", (data) => error += data.toString());

        py.on("close", () => {
            if (error) return reject(error);
            resolve(JSON.parse(output));
        });
    });
}
