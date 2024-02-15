
test("1+2=3, empty array is empty", () => {
    expect(1 + 2).toBe(3);
    expect([].length).toBe(0);
  });

  const SERVER_URL = "http://localhost:4000";

  test("/postNote - Post a note", async () => {
    const title = "NoteTitleTest";
    const content = "NoteTitleContent";
  
    const postNoteRes = await fetch(`${SERVER_URL}/postNote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        content: content,
      }),
    });
  
    const postNoteBody = await postNoteRes.json();
  
    expect(postNoteRes.status).toBe(200);
    expect(postNoteBody.response).toBe("Note added succesfully.");
  });

  test("/getAllNotes - Return list of zero notes for getAllNotes", async () => {

    //delete all notes
    const deleteAllNotesRes = await fetch(`${SERVER_URL}/deleteAllNotes`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Check if the deletion was successful
    expect(deleteAllNotesRes.status).toBe(200);

    const getAllNotesRes = await fetch(`${SERVER_URL}/getAllNotes`);
  
    expect(getAllNotesRes.status).toBe(200);
    // Assuming the API returns an empty array when there are no notes.
    // Adjust the expected status code and logic based on your API's behavior.
    const getAllNotesBody = await getAllNotesRes.json();
    expect(getAllNotesBody.response).toEqual([]);
  });
  
  test("/getAllNotes - Return list of two notes for getAllNotes", async () => {
    // Add two notes
    const title1 = "NoteTitleTest1";
    const content1 = "NoteContentTest1";
    const postNoteRes1 = await fetch(`${SERVER_URL}/postNote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title1,
        content: content1,
      }),
    });
  
    const title2 = "NoteTitleTest2";
    const content2 = "NoteContentTest2";
    const postNoteRes2 = await fetch(`${SERVER_URL}/postNote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title2,
        content: content2,
      }),
    });
  
    // Ensure both notes were added successfully
    expect(postNoteRes1.status).toBe(200);
    expect(postNoteRes2.status).toBe(200);

  
    // Fetch all notes
    const getAllNotesRes = await fetch(`${SERVER_URL}/getAllNotes`);
    const getAllNotesBody = await getAllNotesRes.json();
  
    // Check if the response status is 200 OK and the length of notes is exactly 2
    expect(getAllNotesRes.status).toBe(200);
    expect(getAllNotesBody.response.length).toBe(2); // Corrected to check the length of the array
  });
  
  
  test("/deleteNote - Delete a note", async () => {

    // Add a note
    const title = "NoteTitleTest3";
    const content = "NoteContentTest3";

    const postNoteRes = await fetch(`${SERVER_URL}/postNote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        content: content,
      }),
    });

    expect(postNoteRes.status).toBe(200);


    //get all notes
    const getAllNotesRes = await fetch(`${SERVER_URL}/getAllNotes`);
    const getAllNotesBody = await getAllNotesRes.json();
    // find the note id of the first note
    const noteId = getAllNotesBody.response[0]._id;

    
    const deleteNoteRes = await fetch(`${SERVER_URL}/deleteNote/${noteId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    
    expect(deleteNoteRes.status).toBe(200);
  
    // Step 2: Attempt to fetch the deleted note to ensure it's actually deleted
    const getNoteRes = await fetch(`${SERVER_URL}/note/${noteId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    expect(getNoteRes.status).toBe(404);
  });
  
  
  test("/patchNote - Patch with content and title", async () => {
    //get all notes
    const getAllNotesRes = await fetch(`${SERVER_URL}/getAllNotes`);
    const getAllNotesBody = await getAllNotesRes.json();
    // find the note id of the first note
    const noteId = getAllNotesBody.response[0]._id;

    const title = "NoteTitleTest3";
    const content = "NoteContentTest3";
  
    const patchNoteRes = await fetch(`${SERVER_URL}/patchNote/${noteId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        content: content,
      }),
    });
  
    expect(patchNoteRes.status).toBe(200);
  
    const getAllNotesRes2 = await fetch(`${SERVER_URL}/getAllNotes`);
    const getAllNotesBody2 = await getAllNotesRes2.json();

    expect(getAllNotesBody2.response[0].title).toBe(title);
    expect(getAllNotesBody2.response[0].content).toBe(content);

  });
  
  test("/patchNote - Patch with just title", async () => {
     //get all notes
      const getAllNotesRes = await fetch(`${SERVER_URL}/getAllNotes`);
      const getAllNotesBody = await getAllNotesRes.json();

      // find the note id of the first note
      const noteId = getAllNotesBody.response[0]._id;
      const title = "NoteTitleTest4";

      const patchNoteRes = await fetch(`${SERVER_URL}/patchNote/${noteId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title,
        }),
      });

      expect(patchNoteRes.status).toBe(200);

      const getAllNotesRes2 = await fetch(`${SERVER_URL}/getAllNotes`);
      const getAllNotesBody2 = await getAllNotesRes2.json();

      expect(getAllNotesBody2.response[0].title).toBe(title);

  });
  
  test("/patchNote - Patch with just content", async () => {
    // get all notes
    const getAllNotesRes = await fetch(`${SERVER_URL}/getAllNotes`);
    const getAllNotesBody = await getAllNotesRes.json();
    // find the note id of the first note

    const noteId = getAllNotesBody.response[0]._id;
    const content = "NoteContentTest4";

    const patchNoteRes = await fetch(`${SERVER_URL}/patchNote/${noteId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: content,
      }),
    });

    expect(patchNoteRes.status).toBe(200);

    const getAllNotesRes2 = await fetch(`${SERVER_URL}/getAllNotes`);
    const getAllNotesBody2 = await getAllNotesRes2.json();

    expect(getAllNotesBody2.response[0].content).toBe(content);
  });
  
  test("/deleteAllNotes - Delete one note", async () => {
    // get all notes
    const getAllNotesRes = await fetch(`${SERVER_URL}/getAllNotes`);
    const getAllNotesBody = await getAllNotesRes.json();

    originalLength = getAllNotesBody.response.length;

    // find the note id of the first note
    const noteId = getAllNotesBody.response[0]._id;

    const deleteNoteRes = await fetch(`${SERVER_URL}/deleteNote/${noteId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    expect(deleteNoteRes.status).toBe(200);

    const getAllNotesRes2 = await fetch(`${SERVER_URL}/getAllNotes`);
    const getAllNotesBody2  = await getAllNotesRes2.json();

    //check if the note with the id is deleted
    expect(getAllNotesBody2.response.length).toBe(originalLength - 1);
    expect(getAllNotesBody2.response.filter(note => note._id === noteId).length).toBe(0);

  });
  
  test("/deleteAllNotes - Delete three notes", async () => {
    // Add three notes
    const title1 = "DeleteNoteTitleTest1";
    const content1 = "DeleteNoteContentTest1";

    const postNoteRes1 = await fetch(`${SERVER_URL}/postNote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title1,
        content: content1,
      }),
    });

    const title2 = "DeleteNoteTitleTest2";
    const content2 = "DeleteNoteContentTest2";

    const postNoteRes2 = await fetch(`${SERVER_URL}/postNote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title2,
        content: content2,
      }),
    });

    const title3 = "DeleteNoteTitleTest3";
    const content3 = "DeleteNoteContentTest3";

    const postNoteRes3 = await fetch(`${SERVER_URL}/postNote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title3,
        content: content3,
      }),
    });

    // Ensure all notes were added successfully
    expect(postNoteRes1.status).toBe(200);
    expect(postNoteRes2.status).toBe(200);
    expect(postNoteRes3.status).toBe(200);

    // get all notes
    const getAllNotesRes = await fetch(`${SERVER_URL}/getAllNotes`);
    const getAllNotesBody = await getAllNotesRes.json();

    originalLength = getAllNotesBody.response.length;

    // find the note id of the first note
    const noteId1 = getAllNotesBody.response[0]._id;
    const noteId2 = getAllNotesBody.response[1]._id;
    const noteId3 = getAllNotesBody.response[2]._id;

    //delete notes with the ids
    const deleteNoteRes1 = await fetch(`${SERVER_URL}/deleteNote/${noteId1}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const deleteNoteRes2 = await fetch(`${SERVER_URL}/deleteNote/${noteId2}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const deleteNoteRes3 = await fetch(`${SERVER_URL}/deleteNote/${noteId3}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    expect(deleteNoteRes1.status).toBe(200);
    expect(deleteNoteRes2.status).toBe(200);
    expect(deleteNoteRes3.status).toBe(200);

    const getAllNotesRes2 = await fetch(`${SERVER_URL}/getAllNotes`);
    const getAllNotesBody2  = await getAllNotesRes2.json();

    //check if the note with the id is deleted
    expect(getAllNotesBody2.response.length).toBe(originalLength - 3);
    expect(getAllNotesBody2.response.filter(note => note._id === noteId1).length).toBe(0);
    expect(getAllNotesBody2.response.filter(note => note._id === noteId2).length).toBe(0);
    expect(getAllNotesBody2.response.filter(note => note._id === noteId3).length).toBe(0);


  });
  
  test("/updateNoteColor - Update color of a note to red (#FF0000)", async () => {
    // Add a note
    const title = "UpdateNoteColorTitleTest";
    const content = "UpdateNoteColorContentTest";

    const postNoteRes = await fetch(`${SERVER_URL}/postNote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        content: content,
      }),
    });

    expect(postNoteRes.status).toBe(200);

    // get all notes
    const getAllNotesRes = await fetch(`${SERVER_URL}/getAllNotes`);
    const getAllNotesBody = await getAllNotesRes.json();

    // find the note id of the first note
    const noteId = getAllNotesBody.response[0]._id;

    const color = "#FF0000";

    const updateNoteColorRes = await fetch(`${SERVER_URL}/updateNoteColor/${noteId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        color: color,
      }),
    });

    expect(updateNoteColorRes.status).toBe(200);

    const getAllNotesRes2 = await fetch(`${SERVER_URL}/getAllNotes`);
    const getAllNotesBody2 = await getAllNotesRes2.json();

    expect(getAllNotesBody2.response[0].color).toBe(color);

  });


  afterAll(async () => {
    const deleteAllNotesRes = await fetch(`${SERVER_URL}/deleteAllNotes`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  
    // Check if the deletion was successful
    expect(deleteAllNotesRes.status).toBe(200);
    const deleteAllNotesBody = await deleteAllNotesRes.json();
  });
  