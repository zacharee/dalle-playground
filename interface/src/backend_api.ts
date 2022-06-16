import JsonBigint from "json-bigint";

const REQUEST_TIMEOUT_SEC = 6000000

export async function callDalleService(backendUrl: string, text: string, numImages: number) {
    const queryStartTime = new Date()
    const response = await Promise.race([
        (await fetch(backendUrl + `/dalle`, {
                method: 'POST',
                headers: {
                    'Bypass-Tunnel-Reminder': "go",
                },
                body: JSON.stringify({
                    text,
                    'num_images': numImages,
                })
            }
        ).then((response) => {
            console.error(response)
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response
        })).text(),
        new Promise<string>((_, reject) => setTimeout(
            () => reject(new Error('Timeout')), REQUEST_TIMEOUT_SEC))
    ]);


    return {
        'executionTime': Math.round(((new Date().getTime() - queryStartTime.getTime()) / 1000 + Number.EPSILON) * 100) / 100,
        'generatedImgs': JsonBigint.parse(response)
    }
}

export async function checkIfValidBackend(backendUrl: string, controller: AbortController) {
    const signal = controller.signal

    return await fetch(backendUrl, {
        signal: signal,
        mode: 'no-cors',
        headers: {
            'Bypass-Tunnel-Reminder': "go",
        },
    }).then(() => {
        return true
    }).catch(() => {
        return false
    })
}
