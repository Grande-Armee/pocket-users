import { ClientSession } from '../../unitOfWork/providers/unitOfWorkFactory';

export interface RepositoryFactory<Repository> {
  create(session: ClientSession): Repository;
}
