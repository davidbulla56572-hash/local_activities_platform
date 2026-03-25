import { useAppController } from '../../application/hooks/useAppController'
import { UserRegistrationPresenter } from '../../components/UserRegistrationPresenter'

export function RegistrationPage() {
  const { users, registerUser } = useAppController()

  return <UserRegistrationPresenter users={users} onSubmit={registerUser} />
}
