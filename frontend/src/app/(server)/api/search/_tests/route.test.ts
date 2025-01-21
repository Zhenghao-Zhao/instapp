/**
 * @jest-environment node
 */
import { GET } from '../route';
describe('GET /api/search', () => {
	it('should return 200', async () => {
		const requestObj = {
			nextUrl: {
				searchParams: new URLSearchParams({ query: 'first', page: '0' }),
			},
		} as any
		const response = await GET(requestObj)
		const body = await response.json();
		expect(response.status).toBe(200);
		console.log(body)
	});
});
