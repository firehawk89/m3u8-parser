import { M3U8_EXTENSION } from '@/constants/global';
import { CustomError, generateErrorResponse, generateSuccessResponse, InvalidUrlError } from '@/utils/errors';

import { M3U8Parser } from './parser';
import { M3U8Scraper } from './scraper';

export const handleM3u8Request = async (request: Request, env: Env): Promise<Response> => {
	try {
		const { searchParams } = new URL(request.url);
		const targetUrl = searchParams.get('url');

		if (!targetUrl) {
			throw new InvalidUrlError('Please provide a ?url= parameter');
		}

		let masterPlaylistUrl = targetUrl;

		if (!targetUrl.includes(M3U8_EXTENSION)) {
			const scraper = new M3U8Scraper(env.BROWSER, targetUrl);
			masterPlaylistUrl = await scraper.findM3u8Url();
		}

		const parser = new M3U8Parser(masterPlaylistUrl);
		const bestQualityUrl = await parser.getHighestQualityUrl();

		return Response.json(generateSuccessResponse({ m3u8Url: bestQualityUrl }), { status: 200 });
	} catch (error) {
		if (error instanceof CustomError) {
			return Response.json(generateErrorResponse(error.message), { status: error.statusCode });
		}
		return Response.json(generateErrorResponse('An unexpected error occurred'), { status: 500 });
	}
};
