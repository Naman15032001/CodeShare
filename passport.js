var passport= require('passport');
var LocalStrategy=require('passport-local').Strategy;
var FacebookStrategy=require('passport-facebook').Strategy;

passport.serializeUser(function(user,done){
  done(null,user._id);
});

passport.deserializeUser(function(id,done){
  User.findOne({_id:id},function(err,user){
    done(err,user);
  })
});
passport.use(new LocalStrategy({
  usernameField:'email'

},
function(username,password,done){
  User.findOne({email:username},function(err,user){
    if(err) return done(err);
    if(!user){
      return done(null,false,{
        message:'Incorrect Username or password'
      });
    }
    if(!user.validPassword(password)){
      return done(null,false,{
        message :'Incorrect Username or password'
      })
    }
    return done(null,user);

  })
})
);



passport.use(new FacebookStrategy({
  clientID:'322745279457892',
  clientSecret:'7b4009fa5f1de1bc2a94b8a7b07f3304',
  callbackURL:'http://localhost:3000/auth/facebook/callback',
  profileFields:['id','displayName','email']

},function(token,refreshToken,profile,done){

  User.findOne({'facebookId':profile.id},function(err,user){
    if(err) return done(err);

    if(user){

      return done(null,user);
    }
    else{
      User.findOne({email:profile.emails[0].value},function(err,user){
        if(user){
            user.facebookId=profile.id;
            return user.save(function(err){
              if(err) return done(null,false,{message:"Cant save user"});
              return done(null,user);
            })
        }
        var user=new User();
        user.name=profile.displayName;
        user.email=profile.emails[0].value;
        user.facebookId=profile.id;
        user.save(function(err){
          if(err) return done(null,false,{message:"Cant save user"});
          return done(null,user);
        });

      })
    }
  })

}

));
