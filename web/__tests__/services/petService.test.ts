import { petService } from '../../services/petService';
import { request } from '../../services/api';

jest.mock('../../services/api', () => ({
    request: jest.fn(),
}));

describe('petService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const mockFormData = new FormData();
    mockFormData.append('name', 'Buddy');

    it('registerPet calls request with correct parameters', async () => {
        const mockResponse = { id: 1, name: 'Buddy' };
        (request as jest.Mock).mockResolvedValue(mockResponse);

        const result = await petService.registerPet(mockFormData);

        expect(request).toHaveBeenCalledWith('/pets', {
            method: 'POST',
            body: mockFormData,
        });
        expect(result).toEqual(mockResponse);
    });

    it('updatePet calls request with correct parameters', async () => {
        const mockResponse = { id: 1, name: 'Buddy Updated' };
        (request as jest.Mock).mockResolvedValue(mockResponse);
        const petId = 123;

        const result = await petService.updatePet(petId, mockFormData);

        expect(request).toHaveBeenCalledWith(`/pets/${petId}/update`, {
            method: 'POST',
            body: mockFormData,
        });
        expect(result).toEqual(mockResponse);
    });

    it('deletePet calls request with correct parameters', async () => {
        (request as jest.Mock).mockResolvedValue({});
        const petId = 456;

        await petService.deletePet(petId);

        expect(request).toHaveBeenCalledWith(`/pets/delete/${petId}`, {
            method: 'DELETE',
        });
    });

    it('getPet calls request with correct parameters', async () => {
        const mockResponse = { pet_id: 1, pet_name: 'Buddy' };
        (request as jest.Mock).mockResolvedValue(mockResponse);
        const petId = 1;

        const result = await petService.getPet(petId);

        expect(request).toHaveBeenCalledWith(`/pets/${petId}`);
        expect(result).toEqual(mockResponse);
    });

    it('getUserPets calls request with correct parameters', async () => {
        const mockResponse = [{ pet_id: 1, pet_name: 'Buddy' }];
        (request as jest.Mock).mockResolvedValue(mockResponse);

        const result = await petService.getUserPets();

        expect(request).toHaveBeenCalledWith('/users/me/pets');
        expect(result).toEqual(mockResponse);
    });

    it('generateExtract calls request with correct parameters', async () => {
        (request as jest.Mock).mockResolvedValue({ detail: 'Success' });
        const data = { pet_id: 1, name_document: 'Витяг з реєстру домашніх тварин' as const };

        await petService.generateExtract(data);

        expect(request).toHaveBeenCalledWith('/pets/generate-report', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    });
});
