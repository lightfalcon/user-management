import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserFriendsDto } from './dto/user.friends.dto';
import { User } from './interfaces/user.interface';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {};

    @Get()
    getAllUsers(): User[] {
        return this.usersService.getAllUsers();
    }

    @Get(':userId')
    getUserById(@Param('userId') userId: string): User {
        return this.usersService.getUserById(parseInt(userId));
    }

    @Get('/friendship/level')
    method(
        @Query('originUserId') originUserId: string,
        @Query('targetUserId') targetUserId: string
    ) {
        return this.usersService.findFriendshipDistanceLevel(parseInt(originUserId), parseInt(targetUserId));
    }

    @Post()
    addUser(@Body() userDto: UserDto): User {
        return this.usersService.createUser(userDto);
    }

    @Post('/bulk')
    addBulkUsers(@Body() bulkUsers: UserDto[]): User[] {
        return this.usersService.createUsersBulk(bulkUsers);
    }

    @Post('/friends')
    addFriendsToUsers(@Body() userFriendsDto: UserFriendsDto[]) {
        this.usersService.addFriendsToUsers(userFriendsDto);
    }

    @Put(':userId')
    updateUserById(@Param('userId') userId: string, @Body() userDto: UserDto): User {
        return this.usersService.updateUserById(parseInt(userId), userDto);
    }

    @Delete(':userId')
    deleteUserById(@Param('userId') userId: string) {
        this.usersService.deleteUserById(parseInt(userId));
    }
}
