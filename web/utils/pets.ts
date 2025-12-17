import {
    GenerateExtractRequest,
    GenerateExtractResponse,
    UserPet,
} from '../types/api';
import { petService } from '../services/petService';

export type ExtractType =
    | 'Витяг з реєстру домашніх тварин'
    | 'Медичний витяг про проведені щеплення тварини'
    | 'Офіційний витяг про ідентифікаційні дані тварини';

export async function fetchUserPets(): Promise<UserPet[]> {
    return petService.getUserPets();
}

export async function generateExtract(
    data: GenerateExtractRequest,
): Promise<GenerateExtractResponse> {
    return petService.generateExtract(data);
}
