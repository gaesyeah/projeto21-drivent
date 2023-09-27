import { Address, Enrollment } from '@prisma/client';
import { invalidDataError } from '@/errors';
import { CreateAddressParams, CreateEnrollmentParams, addressRepository, enrollmentRepository } from '@/repositories';
import { exclude } from '@/utils/prisma-utils';
import { request } from '@/utils/request';

async function getAddressFromCEP(cep: string) {
  const {
    data: { logradouro, complemento, bairro, localidade, uf, erro },
  } = await request.get(`${process.env.VIA_CEP_API}/${cep}/json/`);
  if (erro) throw invalidDataError('non-existent zip code');

  type CepDataType = { logradouro: string; complemento: string; bairro: string; cidade: string; uf: string };
  const cepData: CepDataType = { logradouro, complemento, bairro, cidade: localidade, uf };

  return cepData;
}

async function getOneWithAddressByUserId(userId: number): Promise<GetOneWithAddressByUserIdResult> {
  const enrollmentWithAddress = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollmentWithAddress) throw invalidDataError('this registration does not have an address');

  const [firstAddress] = enrollmentWithAddress.Address;
  const address = getFirstAddress(firstAddress);

  return {
    ...exclude(enrollmentWithAddress, 'userId', 'createdAt', 'updatedAt', 'Address'),
    ...(!!address && { address }),
  };
}

type GetOneWithAddressByUserIdResult = Omit<Enrollment, 'userId' | 'createdAt' | 'updatedAt'>;

function getFirstAddress(firstAddress: Address): GetAddressResult {
  if (!firstAddress) return null;

  return exclude(firstAddress, 'createdAt', 'updatedAt', 'enrollmentId');
}

type GetAddressResult = Omit<Address, 'createdAt' | 'updatedAt' | 'enrollmentId'>;

async function createOrUpdateEnrollmentWithAddress(params: CreateOrUpdateEnrollmentWithAddress) {
  const enrollment = exclude(params, 'address');
  enrollment.birthday = new Date(enrollment.birthday);
  const address = getAddressForUpsert(params.address);

  await getAddressFromCEP(address.cep.replace('-', ''));

  const newEnrollment = await enrollmentRepository.upsert(params.userId, enrollment, exclude(enrollment, 'userId'));

  await addressRepository.upsert(newEnrollment.id, address, address);
}

function getAddressForUpsert(address: CreateAddressParams) {
  return {
    ...address,
    ...(address?.addressDetail && { addressDetail: address.addressDetail }),
  };
}

export type CreateOrUpdateEnrollmentWithAddress = CreateEnrollmentParams & {
  address: CreateAddressParams;
};

export const enrollmentsService = {
  getOneWithAddressByUserId,
  createOrUpdateEnrollmentWithAddress,
  getAddressFromCEP,
};
