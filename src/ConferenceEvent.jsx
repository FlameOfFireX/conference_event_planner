import React, { useState } from "react";
import "./ConferenceEvent.css";
import TotalCost from "./TotalCost";
import { useSelector, useDispatch } from "react-redux";
import { incrementQuantity, decrementQuantity } from "./venueSlice";
import { incrementAvQuantity, decrementAvQuantity } from "./avSlice";
import { toggleMealSelection } from "./mealsSlice";
const mealsTotalCost = calculateTotalCost("meals");

const calculateTotalCost = (section) => {
    let totalCost = 0;
    if (section === "venue") {
        venueItems.forEach((item) => {
            totalCost += item.cost * item.quantity;
        });
    } else if (section === "av") {
        avItems.forEach((item) => {
            totalCost += item.cost * item.quantity;
        });
    } else if (section === "meals") {
        mealsItems.forEach((item) => {
            if (item.selected) {
              totalCost += item.cost * numberOfPeople;
            }
          });
    }
return totalCost;
};

const ConferenceEvent = () => {
  const [showItems, setShowItems] = useState(false);
  const [numberOfPeople, setNumberOfPeople] = useState(1);

  const venueItems = useSelector((state) => state.venue);
  const avItems = useSelector((state) => state.av);
  const dispatch = useDispatch();
  const mealsItems = useSelector((state) => state.meals);

  const remainingAuditoriumQuantity =
    3 - venueItems.find((item) => item.name === "Auditorium Hall (Capacity:200)").quantity;

    const handleMealSelection = (index) => {
        const item = mealsItems[index];
        if (item.selected && item.type === "mealForPeople") {
            // Ensure numberOfPeople is set before toggling selection
            const newNumberOfPeople = item.selected ? numberOfPeople : 0;
            dispatch(toggleMealSelection(index, newNumberOfPeople));
        }
        else {
            dispatch(toggleMealSelection(index));
        }
    };

  const handleIncrementAvQuantity = (index) => {
    dispatch(incrementAvQuantity(index));
  };

  const handleDecrementAvQuantity = (index) => {
    dispatch(decrementAvQuantity(index));
  };

  const handleAddToCart = (index) => {
    if (
      venueItems[index].name === "Auditorium Hall (Capacity:200)" &&
      venueItems[index].quantity >= 3
    ) {
      return;
    }
    dispatch(incrementQuantity(index));
  };

  const handleRemoveFromCart = (index) => {
    if (venueItems[index].quantity > 0) {
      dispatch(decrementQuantity(index));
    }
  };

  const handleToggleItems = () => {
    setShowItems(!showItems);
  };

  const calculateTotalCost = (section) => {
    let totalCost = 0;
    if (section === "venue") {
      venueItems.forEach((item) => {
        totalCost += item.cost * item.quantity;
      });
    } else if (section === "av") {
      avItems.forEach((item) => {
        totalCost += item.cost * item.quantity;
      });
    }
    return totalCost;
  };

  const venueTotalCost = calculateTotalCost("venue");
  const avTotalCost = calculateTotalCost("av");

  const navigateToProducts = (idType) => {
    if (["#venue", "#addons", "#meals"].includes(idType) && showItems) {
      setShowItems(false);
    }
  };

  return (
    <>
      <navbar className="navbar_event_conference">
        <div className="company_logo">Conference Expense Planner</div>
        <div className="left_navbar">
          <div className="nav_links">
            <a href="#venue" onClick={() => navigateToProducts("#venue")}>Venue</a>
            <a href="#addons" onClick={() => navigateToProducts("#addons")}>Add-ons</a>
            <a href="#meals" onClick={() => navigateToProducts("#meals")}>Meals</a>
          </div>
          <button className="details_button" onClick={handleToggleItems}>
            Show Details
          </button>
        </div>
      </navbar>

      <div className="main_container">
        {!showItems ? (
          <div className="items-information">
            {/* Venue Section */}
            <div id="venue" className="venue_container container_main">
              <div className="text">
                <h1>Venue Room Selection</h1>
              </div>
              <div className="venue_selection">
                {venueItems.map((item, index) => (
                  <div className="venue_main" key={index}>
                    <div className="img">
                      <img src={item.img} alt={item.name} />
                    </div>
                    <div className="text">{item.name}</div>
                    <div>${item.cost}</div>
                    <div className="button_container">
                      {item.name === "Auditorium Hall (Capacity:200)" ? (
                        <>
                          <button
                            className={item.quantity === 0 ? "btn-warning btn-disabled" : "btn-minus btn-warning"}
                            onClick={() => handleRemoveFromCart(index)}
                          >
                            &ndash;
                          </button>
                          <span className="selected_count">{item.quantity > 0 ? ` ${item.quantity}` : "0"}</span>
                          <button
                            className={remainingAuditoriumQuantity === 0 ? "btn-success btn-disabled" : "btn-success btn-plus"}
                            onClick={() => handleAddToCart(index)}
                          >
                            &#43;
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className={item.quantity === 0 ? "btn-warning btn-disabled" : "btn-warning btn-plus"}
                            onClick={() => handleRemoveFromCart(index)}
                          >
                            &ndash;
                          </button>
                          <span className="selected_count">{item.quantity > 0 ? ` ${item.quantity}` : "0"}</span>
                          <button
                            className={item.quantity === 10 ? "btn-success btn-disabled" : "btn-success btn-plus"}
                            onClick={() => handleAddToCart(index)}
                          >
                            &#43;
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="total_cost">Total Cost: ${venueTotalCost}</div>
            </div>

            {/* Add-ons Section */}
            <div id="addons" className="venue_container container_main">
              <div className="text">
                <h1>Add-ons Selection</h1>
              </div>
              <div className="addons_selection">
                {avItems.map((item, index) => (
                  <div className="av_data venue_main" key={index}>
                    <div className="img">
                      <img src={item.img} alt={item.name} />
                    </div>
                    <div className="text">{item.name}</div>
                    <div>${item.cost}</div>
                    <div className="addons_btn">
                      <button className="btn-warning" onClick={() => handleDecrementAvQuantity(index)}>
                        &ndash;
                      </button>
                      <span className="quantity-value">{item.quantity}</span>
                      <button className="btn-success" onClick={() => handleIncrementAvQuantity(index)}>
                        &#43;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="total_cost">Total Cost: ${avTotalCost}</div>
            </div>

            {/* Meals Section */}
            <div id="meals" className="venue_container container_main">
              <div className="text">
                <h1>Meals Selection</h1>
              </div>
              <div className="input-container venue_selection">
                    <label htmlFor="numberOfPeople"><h3>Number of People:</h3></label>
                    <input type="number" className="input_box5" id="numberOfPeople" value={numberOfPeople}
                        onChange={(e) => setNumberOfPeople(parseInt(e.target.value))}
                        min="1"
                    />
              </div>
              <div className="meal_selection">
                    {mealsItems.map((item, index) => (
                        <div className="meal_item" key={index} style={{ padding: 15 }}>
                            <div className="inner">
                                <input type="checkbox" id={ `meal_${index}` }
                                    checked={ item.selected }
                                    onChange={() => handleMealSelection(index)}
                                />
                                <label htmlFor={`meal_${index}`}> {item.name} </label>
                            </div>
                            <div className="meal_cost">${item.cost}</div>
                        </div>
                    ))}
               </div>
               <div className="total_cost">Total Cost: {mealsTotalCost}</div>            </div>
          </div>
        ) : (
          <div className="total_amount_detail">
            <TotalCost
              totalCosts={{
                venue: venueTotalCost,
                av: avTotalCost
              }}
              handleClick={handleToggleItems}
              ItemsDisplay={() => <></>} // Placeholder for ItemsDisplay component
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ConferenceEvent;
