import { User } from './interfaces/user.interface';
import { FriendLevel } from './interfaces/friend.level.interface';
import { UserDto } from './dto/user.dto';
import { UserFriendsDto } from './dto/user.friends.dto';
export declare class UsersService {
    private readonly logger;
    private readonly users;
    createUser(userDto: UserDto): User;
    createUsersBulk(userDtoArray: UserDto[]): User[];
    getAllUsers(): User[];
    getUserById(userId: number): User;
    updateUserById(userId: number, userDto: UserDto): User;
    deleteUserById(userId: number): void;
    addFriendsToUsers(userFriendsDto: UserFriendsDto[]): void;
    private findIndexByUserId;
    findFriendshipDistanceLevel(originUserId: number, targetUserId: number): FriendLevel;
}
