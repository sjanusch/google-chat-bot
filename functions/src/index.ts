import * as functions from "firebase-functions";
import {region} from "./config";
import {verifyBearerToken, verifyJWTToken} from "./verification";
import {chat_v1} from "googleapis/build/src/apis/chat/v1";

export const googleChatBot = functions.region(region).https.onRequest(async (req, res): Promise<void> => {
	const tokenVerified = await verifyBearerToken(req);
	const jwtVerified = await verifyJWTToken(req)
	if (!tokenVerified || !jwtVerified) {
		res.sendStatus(401);
		return;
	}
	const body = req.body as chat_v1.Schema$DeprecatedEvent;
	functions.logger.log(JSON.stringify(body));
	if (body && body.message) {
		const reply: chat_v1.Schema$Message = {
			text: body.message.text,
		};
		res.send(reply);
	} else {
		const fallBack: chat_v1.Schema$Message = {
			text: "Nothing to say",
		};
		res.send(fallBack);
	}

});
