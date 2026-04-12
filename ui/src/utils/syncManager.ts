import { openDB } from 'idb';

export const flushManualQueue = async () => {
    try {
        const db = await openDB('workbox-background-sync');
        const queueNames = ["ismr-post-sync-queue", "ismr-put-sync-queue"];
        queueNames.forEach(async (queueName) => {

            if (!db.objectStoreNames.contains('requests')) return;

            const allRequests = await db.getAll('requests');
            const successfulIds: any[] = [];

            for (const entry of allRequests) {
                if (entry.queueName === queueName) {
                    try {
                        const sReq = entry.storableRequest;
                        const requestData = sReq?.requestData || entry.requestData;

                        if (!requestData) continue;

                        // Handle Body (Convert Blob to text if needed for POST/PUT)
                        let body = requestData.body;
                        if (body instanceof Blob) {
                            body = await body.text();
                        }

                        const response = await fetch(requestData.url, {
                            method: requestData.method, // Automatically handles POST or PUT
                            headers: requestData.headers,
                            body: body,
                        });

                        if (response.ok) {
                            successfulIds.push(entry.id);
                            console.log(`Synced ${requestData.method} for ${requestData.url}`);
                        }
                    } catch (innerErr) {
                        console.error("Replay failed:", innerErr);
                    }
                }
            }


            if (successfulIds.length > 0) {
                const deleteTx = db.transaction('requests', 'readwrite');
                const deleteStore = deleteTx.objectStore('requests');
                for (const id of successfulIds) {
                    await deleteStore.delete(id);
                }
                await deleteTx.done;
            };
        });
    } catch (err) {
        console.warn("Sync manager skip (DB not ready)");
    }
};