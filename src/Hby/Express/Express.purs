module Hby.Express.Express where

import Prelude
import Data.Argonaut (Json)
import Hby.Task (Task)

----------------------
foreign import data App :: Type

foreign import data AppBuilder :: Type

foreign import data Req :: Type

foreign import data Res :: Type

foreign import data Middle :: Type

foreign import data Route :: Type

foreign import data RouteBuilder :: Type

----------------------
type Path
  = String

----------------------
foreign import app :: AppBuilder

foreign import mkApp :: AppBuilder -> Task App

----------------------
foreign import mkMiddle :: (Req -> Res -> Task Unit) -> Middle

foreign import useMiddle :: Middle -> AppBuilder -> AppBuilder

----------------------
foreign import route :: RouteBuilder

foreign import setGet :: RouteBuilder -> Path -> (Req -> Res -> Task Unit) -> RouteBuilder

foreign import setPost :: RouteBuilder -> Path -> (Req -> Res -> Task Unit) -> RouteBuilder

foreign import mkRoute :: RouteBuilder -> Task Route

foreign import useRoute :: Path -> Route -> AppBuilder -> AppBuilder

----------------------
foreign import getBody :: Req -> Json

foreign import getQuery :: Req -> Json

----------------------
foreign import send :: Res -> Json -> Task Unit

----------------------
type Port
  = Int

type CallBack
  = Task Unit

foreign import listen :: App -> Port -> CallBack -> Task Unit

----------------------
foreign import _middle_json :: Unit -> Middle

middle_json :: Middle
middle_json = _middle_json unit

foreign import _middle_urlencoded :: Unit -> Middle

middle_urlencoded :: Middle
middle_urlencoded = _middle_urlencoded unit

foreign import _middle_cookieParser :: Unit -> Middle

middle_cookieParser :: Middle
middle_cookieParser = _middle_cookieParser unit

----------------------
