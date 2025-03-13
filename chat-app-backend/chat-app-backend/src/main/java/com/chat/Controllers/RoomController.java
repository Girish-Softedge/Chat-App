package com.chat.Controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.chat.Entities.Message;
import com.chat.Entities.Room;
import com.chat.Repositories.RoomRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

@RestController
@CrossOrigin("http://localhost:5173")
@RequestMapping("/api/rooms")
public class RoomController {

	@Autowired
    private final RoomRepository roomRepository;

    
    public RoomController(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createRoom(@RequestBody String roomId) {
        if (roomRepository.findByRoomId(roomId) != null) {
            return ResponseEntity.badRequest().body("Room Already Exists!");
        }
        
        Room room = new Room();
        room.setRoomId(roomId);
        Room savedRoom = roomRepository.save(room);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRoom);
    }
    
    @GetMapping("/{roomId}")
    public ResponseEntity<?> JoinRoom(@PathVariable String roomId){
    	
    	Room room=roomRepository.findByRoomId(roomId);
    	if(room==null) {
    		return ResponseEntity.badRequest().body("Room not found!");
    	}
    	
    	return ResponseEntity.ok(room);
    	
    }
    
    @GetMapping("/{roomId}/messages")
    public ResponseEntity<List<Message>> getMessages(@PathVariable String roomId,@RequestParam(value="page",defaultValue="0",required=false)int page,
    		@RequestParam(value="size",defaultValue="20",required=false) int size){
    	
    	Room room=roomRepository.findByRoomId(roomId);
    	
    	if(room==null) {
    		return ResponseEntity.badRequest().build();
    	}
    	
    	
    	List<Message> messages=room.getMessages();
    	
    	int start=Math.max(0,messages.size()-(page+1)*size);
    	int end=Math.min(messages.size(), start+size);
    	List<Message> paginatedMessages=messages.subList(start, end);
    	return ResponseEntity.ok(paginatedMessages);
		
    	
    	
    }
}
