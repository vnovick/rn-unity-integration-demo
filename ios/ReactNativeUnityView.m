#import "ReactNativeUnityView.h"
#import "ReactNativeUnity.h"

NSDictionary* appLaunchOpts;

@implementation ReactNativeUnityView

-(id)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        _uView = [[[ReactNativeUnity launchWithOptions:appLaunchOpts] appController] rootView];
        [[ReactNativeUnity ufw] registerFrameworkListener:self];
        [NSClassFromString(@"FrameworkLibAPI") registerAPIforNativeCalls:self];
    }
    return self;
}

- (void)layoutSubviews
{
    [super layoutSubviews];

    [_uView removeFromSuperview];
    _uView.frame = self.bounds;
    [self insertSubview:_uView atIndex:0];
}

+ (void)pauseUnity:(BOOL * _Nonnull)pause
{
    [[ReactNativeUnity ufw] pause:pause];
}

+ (void)UnityPostMessage:(NSString*)gameObject methodName:(NSString*)methodName message:(NSString*) message {
    dispatch_async(dispatch_get_main_queue(), ^{
        [[ReactNativeUnity ufw] sendMessageToGOWithName:[gameObject UTF8String] functionName:[methodName UTF8String] message:[message UTF8String]];
    });
}

- (void)sendMessageToMobileApp:(NSString *)message {
    if (self.onUnityMessage) {
        NSDictionary* data = @{
            @"message": message
        };

        self.onUnityMessage(data);
    }
}


@end
