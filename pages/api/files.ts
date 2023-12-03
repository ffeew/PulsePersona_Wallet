import type { NextApiRequest, NextApiResponse } from "next";

const pinataSDK = require("@pinata/sdk");
const pinata = new pinataSDK({ pinataJWTKey: process.env.PINATA_JWT });

export const config = {
	api: {
		bodyParser: false,
	},
};

const keyRestrictions = {
	keyName: "Signed Upload JWT",
	maxUses: 1,
	permissions: {
		endpoints: {
			data: {
				pinList: false,
				userPinnedDataTotal: false,
			},
			pinning: {
				pinFileToIPFS: true,
				pinJSONToIPFS: false,
				pinJobs: false,
				unpin: false,
				userPinPolicy: false,
			},
		},
	},
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method === "POST") {
		try {
			const options = {
				method: "POST",
				headers: {
					accept: "application/json",
					"content-type": "application/json",
					authorization: `Bearer ${process.env.PINATA_JWT}`,
				},
				body: JSON.stringify(keyRestrictions),
			};

			const jwtRepsonse = await fetch(
				"https://api.pinata.cloud/users/generateApiKey",
				options
			);
			const json = await jwtRepsonse.json();
			const { JWT } = json;
			res.send(JWT);
		} catch (e) {
			console.log(e);
			res.status(500).send("Server Error");
		}
	} else if (req.method === "GET") {
		try {
			const response = await pinata.pinList(
				{ pinataJWTKey: process.env.PINATA_JWT },
				{
					pageLimit: 1,
				}
			);
			res.json(response.rows[0]);
		} catch (e) {
			console.log(e);
			res.status(500).send("Server Error");
		}
	}
}
