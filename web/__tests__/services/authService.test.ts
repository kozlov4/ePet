import { authService } from '../../services/authService';
import { request } from '../../services/api';

jest.mock('../../services/api', () => ({
    request: jest.fn(),
}));

describe('authService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('login calls request with correct parameters', async () => {
        const mockResponse = {
            access_token: 'fake-token',
            token_type: 'bearer',
            user_name: 'Test User',
        };

        (request as jest.Mock).mockResolvedValue(mockResponse);

        const username = 'test@example.com';
        const password = 'password123';

        const result = await authService.login(username, password);

        expect(request).toHaveBeenCalledTimes(1);
        expect(request).toHaveBeenCalledWith(
            '/login',
            expect.objectContaining({
                method: 'POST',
                headers: expect.objectContaining({
                    'Content-Type': 'application/x-www-form-urlencoded',
                }),
                skipAuth: true,
            }),
        );

        const callArgs = (request as jest.Mock).mock.calls[0];
        const requestOptions = callArgs[1];
        const bodyParams = new URLSearchParams(requestOptions.body);

        expect(bodyParams.get('username')).toBe(username);
        expect(bodyParams.get('password')).toBe(password);
        expect(bodyParams.get('grant_type')).toBe('password');

        expect(result).toEqual(mockResponse);
    });
});
