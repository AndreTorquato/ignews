import { useSession, signIn } from 'next-auth/client';
import styles from './styles.module.scss';

interface SubscribeButtonsProps{
    priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonsProps){
    const [session] = useSession();

    function handleSubscribe(){
        if(!session){
            signIn('github');
            return;
        }
        
    }
    return (
        <button 
        type="button"
        className={styles.subscribeButton}
        >
            Subscribe now
        </button>
    );
}