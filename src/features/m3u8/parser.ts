import { FetchError } from '@/utils/errors';

const STREAM_INFO_TAG = '#EXT-X-STREAM-INF';

type VariantStream = {
	bandwidth: number;
	url: string;
};

export class M3U8Parser {
	constructor(private readonly playlistUrl: string) {}

	public async getHighestQualityUrl(): Promise<string> {
		const playlistText = await this.fetchPlaylist();
		const variants = this.parseVariantStreams(playlistText);

		if (variants.length === 0) {
			return this.playlistUrl;
		}

		return variants.reduce((best, current) => (current.bandwidth > best.bandwidth ? current : best)).url;
	}

	private async fetchPlaylist(): Promise<string> {
		const response = await fetch(this.playlistUrl);

		if (!response.ok) {
			throw new FetchError('Failed to fetch playlist', response.status);
		}

		return response.text();
	}

	private parseVariantStreams(playlistText: string): VariantStream[] {
		if (!playlistText.includes(STREAM_INFO_TAG)) {
			return [];
		}

		const lines = playlistText.split('\n').map((l) => l.trim());
		const variants: VariantStream[] = [];

		for (let i = 0; i < lines.length - 1; i++) {
			const line = lines[i];

			if (!line.startsWith(STREAM_INFO_TAG)) {
				continue;
			}

			const bandwidth = this.extractBandwidth(line);
			const nextLine = lines[i + 1];

			if (!nextLine || nextLine.startsWith('#')) {
				continue;
			}

			variants.push({
				bandwidth,
				url: new URL(nextLine, this.playlistUrl).href,
			});
		}

		return variants;
	}

	private extractBandwidth(line: string): number {
		const match = /BANDWIDTH=(\d+)/.exec(line);
		return match ? Number(match[1]) : 0;
	}
}
