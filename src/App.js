import React, { useState } from "react";
import './App.css'
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const itemsFirstColumn = [
  { id: 'ad', color: "rgb(196, 196, 196)" },
  { id: 'cd', color: "rgb(196, 196, 196)" },
  { id: 'rt', color: "rgb(196, 196, 196)" }
];

const itemsSecoundColumn = [
  { id: 'ac', color: "rgb(95, 113, 212)" },
  { id: 'fv', color: "rgb(95, 113, 212)" },
  { id: 'ty', color: "rgb(95, 113, 212)" }
]

const itemsThirdColumn = [
  { id: 'za', color: "purple" },
  { id: 'zb', color: "purple" },
  { id: 'zc', color: "purple" }
]

const itemsFourColumn = [
  { id: 'zd', color: "lightgreen" },
  { id: 'ze', color: "lightgreen" },
  { id: 'zf', color: "lightgreen" }
]

const columnsFromBackend = {
  1: {
    name: "BOUNTIES",
    items: itemsFirstColumn,
    color: 'rgb(196, 196, 196)'
  },
  2: {
    name: "ASSIGNED/IN PROGRESS",
    items: itemsSecoundColumn,
    color: 'rgb(95, 113, 212)'
  },
  3: {
    name: "UNDER REVIEW",
    items: itemsThirdColumn,
    color: 'purple'
  },
  4: {
    name: "REWARDED",
    items: itemsFourColumn,
    color: 'lightgreen'
  }
};

const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems
      }
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems
      }
    });
  }
};

function App() {
  const [columns, setColumns] = useState(columnsFromBackend);
  return (
    <div className="container" >
      <div className="title" >
        <h1>Bounties</h1>
      </div>
      <div className="wrapper" >
        <DragDropContext
          onDragEnd={result => onDragEnd(result, columns, setColumns)}
        >
          {Object.entries(columns).map(([columnId, column], index) => {
            return (
              <div
                className="heading"
                key={columnId}
              >
                <h3
                  style={{
                    borderBottom: `3px solid ${column.color}`
                  }}
                >
                  {column.name}
                </h3>
                <div style={{ margin: 8 }}>
                  <Droppable droppableId={columnId} key={columnId}>
                    {(provided, snapshot) => {
                      return (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className='board'
                        >
                          {column.items.map((item, index) => {
                            return (
                              <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}
                              >
                                {(provided, snapshot) => {
                                  return (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className='card'
                                      style={{
                                        ...provided.draggableProps.style
                                      }}
                                    >
                                      <div className="cardTop" >
                                        <h2>Write A Blogpost For DAOHelper</h2>
                                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                                      </div>
                                      <div
                                        className="cardBottom"
                                        style={{
                                          backgroundColor: `${item.color === column.color ? item.color : column.color}`,
                                          color: `${column.color === 'rgb(196, 196, 196)' ? 'black' : 'white'}`
                                        }}
                                      >
                                        <div>Reward: $5</div>
                                        <div>Time Left: 2days</div>
                                      </div>
                                    </div>
                                  );
                                }}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      );
                    }}
                  </Droppable>
                </div>
              </div>
            );
          })}
        </DragDropContext>
      </div>
    </div>
  );
}

export default App;
