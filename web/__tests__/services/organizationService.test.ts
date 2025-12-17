import { organizationService } from '../../services/organizationService';
import { request } from '../../services/api';
import { Organization } from '../../types/api';

jest.mock('../../services/api', () => ({
    request: jest.fn(),
}));

describe('organizationService', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    const mockOrg: Organization = {
        organization_id: '1',
        organization_name: 'Test Org',
        organization_type: 'Type',
        city: 'City',
        street: 'Street',
        building: '1',
        phone_number: '123',
        email: 'test@example.com'
    };

    it('createOrganization calls request with correct parameters', async () => {
        (request as jest.Mock).mockResolvedValue(mockOrg);

        await organizationService.createOrganization(mockOrg);

        const expectedBody = { ...mockOrg };
        delete (expectedBody as any).organization_id;

        expect(request).toHaveBeenCalledWith('/organizations/create', {
            method: 'POST',
            body: JSON.stringify(expectedBody),
        });
    });

    it('updateOrganization calls request with correct parameters', async () => {
        (request as jest.Mock).mockResolvedValue(mockOrg);
        const id = '1';

        await organizationService.updateOrganization(id, mockOrg);

        expect(request).toHaveBeenCalledWith(`/organizations/organizations/${id}`, {
            method: 'PUT',
            body: JSON.stringify(mockOrg),
        });
    });

    it('getOrganization calls request with correct parameters', async () => {
        (request as jest.Mock).mockResolvedValue(mockOrg);
        const id = '1';

        await organizationService.getOrganization(id);

        expect(request).toHaveBeenCalledWith(`/organizations/organizations/${id}`);
    });

        it('deleteOrganization calls request with correct parameters', async () => {

            (request as jest.Mock).mockResolvedValue({});

            const id = '1';

    

            await organizationService.deleteOrganization(id);

    

            expect(request).toHaveBeenCalledWith(`/organizations/organizations/${id}`, {

                method: 'DELETE',

            });

        });

    

            it('getOrganizationList calls request with correct parameters', async () => {

    

                (request as jest.Mock).mockResolvedValue([]);

    

        

    

                await organizationService.getOrganizationList();

    

        

    

                expect(request).toHaveBeenCalledWith('/organizations/organization/list');

    

            });

    

        

    

            it('getOrganizationInfo calls request with correct parameters', async () => {

    

                (request as jest.Mock).mockResolvedValue(mockOrg);

    

        

    

                await organizationService.getOrganizationInfo();

    

        

    

                expect(request).toHaveBeenCalledWith('/organizations/info');

    

            });

    

        });

    

        

    