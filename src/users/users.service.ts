import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { FriendLevel } from './interfaces/friend.level.interface';
import { UserDto } from './dto/user.dto';
import { UserFriendsDto } from './dto/user.friends.dto';

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);

    //Let's simulate a DB table to store User records
    private readonly users: User[] = [];

    //--------- Define CRUD service methods required ------------
    //Method to create new user based on DTO param
    createUser(userDto: UserDto): User {
        this.logger.log(`Trying to build user: ${userDto}`)
        //Mock auto-increment id
        let nextId: number;
        function addUserId(usersArray: User[]): number {
            if (usersArray.length > 0) {
                nextId = usersArray[usersArray.length - 1].userId + 1;
                return nextId;
            } else {
                return nextId = 1;
            }
        }

        //Build User object with id
        let newUser = {
            userId: addUserId(this.users),
            friends: [],
            ...userDto
        }

        this.users.push(newUser);
        return newUser;
    }

    //Create new users in bulk
    createUsersBulk(userDtoArray: UserDto[]): User[] {
        let usersCreated: User[] = [];

        for (let i = 0; i < userDtoArray.length; i++) {
            let createdUser = this.createUser(userDtoArray[i]);
            usersCreated.push(createdUser);
        }

        if (usersCreated.length === 0) {
            throw new BadRequestException('Array of users was not provided');
        }
        
        return usersCreated;
    }

    //Retrieve all users
    getAllUsers(): User[] {
        return this.users;
    }

    //Retrieve a user by userId
    getUserById(userId: number): User {
        return this.users[this.findIndexByUserId(userId)];
    }

    //Update a user by userId
    updateUserById(userId: number, userDto: UserDto): User {
        const arrayIndex = this.findIndexByUserId(userId);

        let updatedUser = {
            userId: this.users[arrayIndex].userId,
            friends: [],
            ...userDto
        }

        this.users.splice(arrayIndex, 1, updatedUser);
        return this.users[arrayIndex];
    }

    //Delete a user by userId
    deleteUserById(userId: number) {
        const arrayIndex = this.findIndexByUserId(userId);
        this.users.splice(arrayIndex, 1);
    }

    //Add friends by its userId to Users
    addFriendsToUsers(userFriendsDto: UserFriendsDto[]) {
        for (let i = 0; i < userFriendsDto.length; i++) {
            let userId = userFriendsDto[i].userId;
            let userFriendsArray = userFriendsDto[i].friendsUserIds;

            let updatedUser = {
                ...this.getUserById(userId),
                friends: userFriendsArray
            }

            const arrayIndex = this.findIndexByUserId(userId);
            this.users.splice(arrayIndex, 1, updatedUser)
        }
    }

    //Since I'm using an array to mock a User table, I need a method to find the userId position(array index)
    //within the array since the Array index and userId could be different
    private findIndexByUserId(userId: number): number {
        this.logger.log(`Find position of userId: ${userId}`)
        let userIndex: number;
        let indexFound: boolean = false;
        this.users.forEach(function(user: User, index: number) {
            if (user.userId === userId) {
                userIndex = index;
                console.log(`Find user at array position(index): ${userIndex}`)
                indexFound = true;
                return;
            }
        })

        if (!indexFound) {
            throw new NotFoundException(`User with id: ${userId} was not found`);
        }
        
        return userIndex;
    }

    // ------- Evaluate Friendship distance level -------
    // Given the problem proposed by Blake and based on quick research about social networks friendships
    // I decided to implement a graph to represent relationships and BFS own solution to find friendship level.
    // Graph is my array of users -> each user object includes a Friendship array
    findFriendshipDistanceLevel(originUserId: number, targetUserId: number): FriendLevel {
        let targetUserIdFound: FriendLevel;
        let myQueue: FriendLevel[] = [];
        const visited = new Set<number>([originUserId])

        let queueOffset: number = 0;
        const friendLevelObj: FriendLevel = {
            friendUserId: originUserId,
            level: 0
        }
        myQueue.push(friendLevelObj)

        for (let i = 0; i < myQueue.length; i++) {
            //Dequeue 
            const user: FriendLevel = myQueue[queueOffset];
            const friendLevel: number = user.level;

            //Eval
            if (user.friendUserId === targetUserId) {
                targetUserIdFound = user;
                break;
            }

            //Let's add the friends of the current user to the queue
            for (const friend of this.users[this.findIndexByUserId(user.friendUserId)].friends) {
                console.log(this.users[this.findIndexByUserId(user.friendUserId)].friends)
                if (!visited.has(friend)) {
                    visited.add(friend);
                    const friendLevelObj: FriendLevel = {
                        friendUserId: friend,
                        level: friendLevel + 1
                    }
                    myQueue.push(friendLevelObj);
                }
            }

            queueOffset += 1;
            if (queueOffset > myQueue.length - 1) {
                console.log("No more elements in queue");
            }

        }
        return targetUserIdFound;
    }
}
