package com.chat.Entities;	

import java.time.LocalDateTime;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Document(collection = "messages")
@Getter
@Setter
@NoArgsConstructor
public class Message {
	
	private String sender;
	private String content;
	private LocalDateTime timeStamp;
	
	public Message(String sender, String content, LocalDateTime timeStamp) {
		super();
		this.sender = sender;
		this.content = content;
		this.timeStamp = LocalDateTime.now();
	}


}
