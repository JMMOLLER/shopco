import UserRegistration from "./UserRegistration";

const UserLogin = UserRegistration.pick({ email: true, password: true });

export default UserLogin;