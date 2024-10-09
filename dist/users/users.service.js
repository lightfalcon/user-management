"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
let UsersService = UsersService_1 = class UsersService {
    constructor() {
        this.logger = new common_1.Logger(UsersService_1.name);
        this.users = [];
    }
    createUser(userDto) {
        this.logger.log(`Trying to build user: ${userDto}`);
        let nextId;
        function addUserId(usersArray) {
            if (usersArray.length > 0) {
                nextId = usersArray[usersArray.length - 1].userId + 1;
                return nextId;
            }
            else {
                return nextId = 1;
            }
        }
        let newUser = {
            userId: addUserId(this.users),
            friends: [],
            ...userDto
        };
        this.users.push(newUser);
        return newUser;
    }
    createUsersBulk(userDtoArray) {
        let usersCreated = [];
        for (let i = 0; i < userDtoArray.length; i++) {
            let createdUser = this.createUser(userDtoArray[i]);
            usersCreated.push(createdUser);
        }
        if (usersCreated.length === 0) {
            throw new common_1.BadRequestException('Array of users was not provided');
        }
        return usersCreated;
    }
    getAllUsers() {
        return this.users;
    }
    getUserById(userId) {
        return this.users[this.findIndexByUserId(userId)];
    }
    updateUserById(userId, userDto) {
        const arrayIndex = this.findIndexByUserId(userId);
        let updatedUser = {
            userId: this.users[arrayIndex].userId,
            friends: [],
            ...userDto
        };
        this.users.splice(arrayIndex, 1, updatedUser);
        return this.users[arrayIndex];
    }
    deleteUserById(userId) {
        const arrayIndex = this.findIndexByUserId(userId);
        this.users.splice(arrayIndex, 1);
    }
    addFriendsToUsers(userFriendsDto) {
        for (let i = 0; i < userFriendsDto.length; i++) {
            let userId = userFriendsDto[i].userId;
            let userFriendsArray = userFriendsDto[i].friendsUserIds;
            let updatedUser = {
                ...this.getUserById(userId),
                friends: userFriendsArray
            };
            const arrayIndex = this.findIndexByUserId(userId);
            this.users.splice(arrayIndex, 1, updatedUser);
        }
    }
    findIndexByUserId(userId) {
        this.logger.log(`Find position of userId: ${userId}`);
        let userIndex;
        let indexFound = false;
        this.users.forEach(function (user, index) {
            if (user.userId === userId) {
                userIndex = index;
                console.log(`Find user at array position(index): ${userIndex}`);
                indexFound = true;
                return;
            }
        });
        if (!indexFound) {
            throw new common_1.NotFoundException(`User with id: ${userId} was not found`);
        }
        return userIndex;
    }
    findFriendshipDistanceLevel(originUserId, targetUserId) {
        let targetUserIdFound;
        let myQueue = [];
        const visited = new Set([originUserId]);
        let queueOffset = 0;
        const friendLevelObj = {
            friendUserId: originUserId,
            level: 0
        };
        myQueue.push(friendLevelObj);
        for (let i = 0; i < myQueue.length; i++) {
            const user = myQueue[queueOffset];
            const friendLevel = user.level;
            if (user.friendUserId === targetUserId) {
                targetUserIdFound = user;
                break;
            }
            for (const friend of this.users[this.findIndexByUserId(user.friendUserId)].friends) {
                console.log(this.users[this.findIndexByUserId(user.friendUserId)].friends);
                if (!visited.has(friend)) {
                    visited.add(friend);
                    const friendLevelObj = {
                        friendUserId: friend,
                        level: friendLevel + 1
                    };
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
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)()
], UsersService);
//# sourceMappingURL=users.service.js.map