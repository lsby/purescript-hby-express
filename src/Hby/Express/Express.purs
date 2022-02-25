module Hby.Express.Express where

import Prelude
import Data.Argonaut (Json)
import Hby.Task (Task)

----------------------
foreign import data App :: Type

foreign import data Req :: Type

foreign import data Res :: Type

foreign import data Middle :: Type

foreign import data Route :: Type

----------------------
type Url
  = String

type Path
  = String

----------------------
foreign import mkApp :: Task App

----------------------
foreign import mkMiddle :: (Req -> Res -> Task Unit) -> Middle

foreign import useMiddle :: App -> Middle -> Task Unit

----------------------
foreign import mkRoute :: Task Route

foreign import setGet :: Route -> Url -> (Req -> Res -> Task Unit) -> Task Unit

foreign import setPost :: Route -> Url -> (Req -> Res -> Task Unit) -> Task Unit

foreign import useRoute :: App -> Url -> Route -> Task Unit

----------------------
foreign import useStatic :: App -> Url -> Path -> Task Unit

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
