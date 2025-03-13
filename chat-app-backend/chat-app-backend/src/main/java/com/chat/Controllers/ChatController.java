package com.chat.Controllers;

import java.time.LocalDateTime;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.chat.Entities.Message;
import com.chat.Entities.Room;
import com.chat.Payloads.MessageRequest;
import com.chat.Repositories.RoomRepository;

@RestController
@CrossOrigin("http://localhost:5173")
public class ChatController {
	
	
	private RoomRepository roomrepository;

	public ChatController(RoomRepository roomrepository) {
		super();
		this.roomrepository = roomrepository;
	}
	

	@MessageMapping("/sendmessage/{roomId}")
	@SendTo("/topic/room/{roomId}")
	public Message SendMessage(@DestinationVariable String roomId,@RequestBody MessageRequest request) {
		
		Room room=roomrepository.findByRoomId(request.getRoomId());
		Message message=new Message();
		message.setContent(request.getContent());
		message.setSender(request.getSender());
		message.setTimeStamp(LocalDateTime.now());
		
		if(room!=null) {
			room.getMessages().add(message);
			roomrepository.save(room);
		}else {
			throw new RuntimeException("room not found!!");
		}
		return message;
		
	}
}
