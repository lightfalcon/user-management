import { UserDto } from './dto/user.dto';
import { UserFriendsDto } from './dto/user.friends.dto';
import { User } from './interfaces/user.interface';
import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getAllUsers(): User[];
    getUserById(userId: string): User;
    method(originUserId: string, targetUserId: string): import("./interfaces/friend.level.interface").FriendLevel;
    addUser(userDto: UserDto): User;
    addBulkUsers(bulkUsers: UserDto[]): User[];
    addFriendsToUsers(userFriendsDto: UserFriendsDto[]): void;
    updateUserById(userId: string, userDto: UserDto): User;
    deleteUserById(userId: string): void;
}
