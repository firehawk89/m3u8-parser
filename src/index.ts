import { handleM3u8Request } from './features/m3u8/handler';

export default {
	async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
		return handleM3u8Request(request, env);
	},
} satisfies ExportedHandler<Env>;
