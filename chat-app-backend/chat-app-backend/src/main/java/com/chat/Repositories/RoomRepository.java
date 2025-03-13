package com.chat.Repositories;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.chat.Entities.Room;

public interface RoomRepository extends MongoRepository<Room,String> {

	Room findByRoomId(String roomId);

}
