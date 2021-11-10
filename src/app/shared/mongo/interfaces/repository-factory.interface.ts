import { ClientSession } from '../../unit-of-work/providers/unit-of-work-factory';

export interface RepositoryFactory<Repository> {
  create(session: ClientSession): Repository;
}
