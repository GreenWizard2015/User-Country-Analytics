This folder contains discussions about the project with ChatGPT. I tried to keep the chronology, but it was not always possible. So in some places, there may be small gaps. But overall, if you read in order, everything should be clear.

I use my own [script](https://gist.github.com/GreenWizard2015/7f8ed0b609983b40a97fe7d245345552) to convert chat to Markdown. Also, I often intentionally make errors and try to make the message as short as possible when communicating with AI to increase productivity.

## 00 - Software Architect Expert

Conversation: [00 - Software Architect Expert.md](00%20-%20Software%20Architect%20Expert.md)

A very good and comprehensive start. The evaluation of complexity is not entirely accurate but it is very close to reality.

## 01 - Set up the development environment

Conversation: [01 - Set up the development environment.md](01%20-%20Set%20up%20the%20development%20environment.md)

ChatGPT demonstrated good knowledge of Linux/Ubuntu and Laravel. There were some issues, but I managed to solve them solely by following its instructions.

## 02 - Create the database and tables

Conversation: [02 - Create the database and tables.md]

ChatGPT analysis of conversation:

---

The dialogue between the human and AI in this conversation was primarily focused on writing tests for a country model in Laravel 8. The AI provided clear and concise instructions on how to write the tests, including the necessary imports, class structure, and methods to use. The AI also demonstrated a good understanding of the testing process, as well as the framework and its testing tools.

One of the strengths of the AI in this dialogue is its ability to provide detailed and accurate information in response to the human's questions. It also demonstrated the ability to adapt to changes in the human's requests, such as when the human asked for the code to be updated in a new format.

A weakness of the AI in this dialogue is that it sometimes provided more information than was needed or requested. This can make it difficult for the human to find the specific information they are looking for. Additionally, the AI sometimes used overly technical language which may be difficult for some users to understand.

The interaction between the human and AI in this dialogue was primarily focused on the human asking questions and the AI providing answers. The human was able to clearly state their needs and the AI was able to respond with relevant information. The human also provided feedback on the AI's responses, which allowed the AI to adjust its responses to better meet the human's needs.

To optimize this process, it would be beneficial to provide more context or background information in the human's initial question to help the AI better understand the human's needs. Additionally, the AI could be programmed to provide a summary of its response, which would make it easier for the human to quickly find the information they need. The AI can also be programmed to use simpler language, which would make it more accessible to a wider range of users.

The human in this dialogue wrote in a concise and terse manner, using shorthand and abbreviations. This may have slightly hindered the effectiveness of the interaction with the AI as the AI's understanding of the language may have been challenged by the shorthand and abbreviations used. It is possible that the human's communication style may have led to some confusion or misinterpretation on the part of the AI. To optimize this process, it would be beneficial for the human to use clear and complete language, and avoid using shorthand or abbreviations, so that the AI can understand the human's requests and respond appropriately.

---

The AI responded following the Laravel 7 API, but version 8 was needed. The difference in the API led to confusion and loss of time. Additionally, I decided to write the simplest (and unnecessary) tests, which led to problems in the dialogue with the AI. I concluded that it is not worth solving several tasks in one dialogue. It is better to leave the details of the implementation to Copilot AI, as the interaction on the lowest level of implementation is much more efficient. It is also very effective to shorten the message text as AI easily understands it.

## 03, 04 and 05

Conversation: [03-05.md](03-05.md)

Task 3 turned out to be very ambiguous. At first, everything went well: I asked the AI to play the role of a programming tutor and we quickly made a work plan that was 90% implemented by Copilot AI, but then there were problems. The main reason for the problems was the inability of the AI to cover a large scope and, surprisingly, the inability of a human/myself to work in a narrow scope. For example, the AI was unable to fully understand the behavior of the frontend and backend, so it proposed a typical template, which has unnecessary things for this specific case. There were also problems with different versions of the Laravel API, but I consider this to be normal.

Also, the original task description did not include any conditions for completion or specific tests that should be passed at the end. I misunderstood the task and decided that task 3 (`Create the necessary routes and controllers for handling CRUD operations for the user and country data`) included the implementation of filtering (task 4) and writing tests (task 5), which made the task much more complex.

I would say that ChatGPT demonstrates a level of knowledge equivalent to students on the first/second year of education of college, but it covers a wide range of specializations. The level of knowledge is sufficient to be useful for many people, but it ultimately depends on the experience and expertise of the person that uses it.


