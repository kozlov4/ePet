import { vaccinationService } from '../../services/vaccinationService';
import { request } from '../../services/api';

jest.mock('../../services/api', () => ({
    request: jest.fn(),
}));

describe('vaccinationService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('getVaccinations calls request with correct parameters', async () => {
        const mockResponse = {
            passport_number: '123',
            update_datetime: '2024-01-01',
            vaccinations: []
        };
        (request as jest.Mock).mockResolvedValue(mockResponse);
        const petId = 456;

        const result = await vaccinationService.getVaccinations(petId);

        expect(request).toHaveBeenCalledWith(`/pets/${petId}/vaccinations`);
        expect(result).toEqual(mockResponse);
    });

    it('addVaccination calls request with correct parameters', async () => {
        (request as jest.Mock).mockResolvedValue({});
        const petId = 456;
        const data = {
            drug_name: 'Test Drug',
            series_number: '123',
            vaccination_date: '01.01.2024',
            valid_until: '01.01.2025'
        };

        await vaccinationService.addVaccination(petId, data);

        expect(request).toHaveBeenCalledWith(`/vaccinations/${petId}`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    });
});
