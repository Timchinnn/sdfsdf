import React from "react";

// libs
import { Route, Switch, Redirect } from "react-router-dom";
import AddEditShopCard from "pages/AddEditShopCard";
import routeAddEditShopCard from "pages/AddEditShopCard/route";
// routePages
import MainPage, { routeMain as routeMainPage } from "pages/MainPage";
import CityPage, { routeCity as routeCityPage } from "pages/CityPage";
import FriendsPage, {
  routeFriends as routeFriendsPage,
} from "pages/FriendsPage";
import ShopPage, { routeShop as routeShopPage } from "pages/ShopPage";
import AddEditCard, {
  routeAddEditCard as routeAddEditCardPage,
} from "pages/AddEditCard";
import AddEditCardBack, {
  routeAddEditCardBack as routeAddEditCardBackPage,
} from "pages/AddEditCardBack";
import AddEditDeck, {
  routeAddEditDeck as routeAddEditDeckPage,
} from "pages/AddEditDeck";
import AddEditCityDeck, {
  routeAddEditCityDeck as routeAddEditCityDeckPage,
} from "pages/AddEditCityDeck";
import AdminPanel, { routeAdmin as routeAdminPage } from "pages/AdminPanel";
import AdsManagement, {
  routeAdsManagement as routeAdsManagementPage,
} from "pages/AdsManagement";
import CardManagement, {
  routeCardManagement as routeCardManagementPage,
} from "pages/CardManagement";
import TasksPage, { routeTasks as routeTasksPage } from "pages/TasksPage";
import SetsPage, { routeSets as routeSetsPage } from "pages/SetsPage";
import BonusPage, { routeBonus as routeBonusPage } from "pages/BonusPage";
import PeoplePage, { routePeople as routePeoplePage } from "pages/PeoplePage";
import BonusCodeManagement, {
  routeBonusCodeManagement as routeBonusCodeManagementPage,
} from "pages/BonusCodeManagement";
import ShopManagement, {
  routeShopManagement as routeShopManagementPage,
} from "pages/ShopManagement";
import ShirtManagement, {
  routeShirtManagement as routeShirtManagementPage,
} from "pages/ShirtManagement";
import { useSelector } from "react-redux";
import AddEditShopSet from "pages/AddEditShopSet";
import { routeAddEditShopSet } from "pages/AddEditShopSet";
import AddEditShopShirt from "pages/AddEditShopShirt";
import { routeAddEditShopShirt } from "pages/AddEditShopShirt";
import UsersList from "pages/UsersList";
import EditUser from 'pages/EditUser';

const AppContent = () => {
  const theme = useSelector((state) => state.theme);

  if (theme === true) {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }

  return (
    <div className={`main-wrapper`}>
      <main className="main-container">
        <Switch>
          <Route
            exact
            path={routeAddEditShopSet()}
            component={AddEditShopSet}
          />
          <Route
            exact
            path={routeAddEditShopSet(":id")}
            component={AddEditShopSet}
          />
          <Route
            exact
            path={routeAddEditShopShirt()}
            component={AddEditShopShirt}
          />
          <Route
            exact
            path={routeAddEditShopShirt(":id")}
            component={AddEditShopShirt}
          />
          <Route exact path="/addEditCard/:id" component={AddEditCard} />
          <Route exact path="/addEditDeck/:id" component={AddEditDeck} />
          <Route
            exact
            path="/addEditCityDeck/:id"
            component={AddEditCityDeck}
          />
          <Route
            path={routeAddEditShopCard()}
            exact
            component={AddEditShopCard}
          />
          <Route
            path={routeAddEditShopCard(":id")}
            exact
            component={AddEditShopCard}
          />
          <Route exact path={routeMainPage()} component={MainPage} />
          <Route exact path={routeAddEditDeckPage()} component={AddEditDeck} />
          <Route
            exact
            path={routeAddEditCityDeckPage()}
            component={AddEditCityDeck}
          />
          <Route exact path={routeCityPage()} component={CityPage} />
          <Route
            exact
            path={routeBonusCodeManagementPage()}
            component={BonusCodeManagement}
          />
          <Route exact path={routeFriendsPage()} component={FriendsPage} />
          <Route exact path={routeShopPage()} component={ShopPage} />
          <Route exact path={routeAddEditCardPage()} component={AddEditCard} />
          <Route
            exact
            path={routeAddEditCardBackPage()}
            component={AddEditCardBack}
          />
          <Route exact path={routeAdminPage()} component={AdminPanel} />
          <Route
            exact
            path={routeAdsManagementPage()}
            component={AdsManagement}
          />
          <Route
            exact
            path={routeCardManagementPage()}
            component={CardManagement}
          />
          <Route exact path={routeTasksPage()} component={TasksPage} />
          <Route exact path={routeSetsPage()} component={SetsPage} />
          <Route
            exact
            path={routeShirtManagementPage()}
            component={ShirtManagement}
          />
          <Route
            exact
            path={routeShopManagementPage()}
            component={ShopManagement}
          />
<Route path="/edit-user/:id/:userId" component={EditUser} />

          <Route exact path={routeBonusPage()} component={BonusPage} />
          <Route exact path={routePeoplePage()} component={PeoplePage} />
                    <Route exact path="/users-list" component={UsersList} />

          <Redirect
            to={{
              pathname: routeMainPage(),
            }}
          />
        </Switch>
      </main>
    </div>
  );
};

export default AppContent;
