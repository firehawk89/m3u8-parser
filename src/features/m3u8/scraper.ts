import puppeteer from '@cloudflare/puppeteer';

import { M3U8_EXTENSION } from '@/constants/global';
import { NotFoundError } from '@/utils/errors';

export class M3U8Scraper {
	constructor(
		private readonly browser: Fetcher,
		private readonly targetUrl: string,
	) {}

	public async findM3u8Url(): Promise<string> {
		let browser;

		try {
			browser = await puppeteer.launch(this.browser);
			const page = await browser.newPage();

			let foundM3u8: string | null = null;

			page.on('request', (req) => {
				const url = req.url();
				if (url.includes(M3U8_EXTENSION) && !foundM3u8) {
					foundM3u8 = url;
				}
			});

			await page.goto(this.targetUrl, { waitUntil: 'networkidle2' });

			if (!foundM3u8) {
				throw new NotFoundError('No .m3u8 request found on this page');
			}

			return foundM3u8;
		} finally {
			if (browser) {
				await browser.close();
			}
		}
	}
}
